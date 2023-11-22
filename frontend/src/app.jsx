import 'bootstrap.css';
import '@grapecity/wijmo.styles/wijmo.css';
import './app.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import * as wjInput from '@grapecity/wijmo.react.input';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Globalize } from '@grapecity/wijmo';

class App extends React.Component {
    constructor(props) {
        super(props);
        this._cellElements = {};
        this.intervalItems = [1, 5, 10, 60];
        this.state = {
            data: [],
            itemPriceHistory: {},
            interval: 1,
        };
        this.initializeGrid = this.initializeGrid.bind(this);
        this.intervalItemsChange = this.intervalItemsChange.bind(this);
    }

    render() {
        const changesTitle = "Changes (%) " + this.state.interval + " min" + (this.state.interval === 1 ? "": "s");
        return <div className="container-fluid">
            <h2>Pricing Data</h2>
            <label>
                Changes per (mins)
                <wjInput.ComboBox itemsSource={this.intervalItems} selectedValue={this.state.interval} textChanged={this.intervalItemsChange}/>
            </label>
            <FlexGrid isReadOnly={true} selectionMode="Row" initialized={this.initializeGrid} itemsSource={this.state.data}>
                <FlexGridColumn binding="name" header="Event Name" width={200}/>
                <FlexGridColumn binding="eventDate" header="Event Date" format="hh:mm:ss mm/dd/yyyy" align="center"/>
                <FlexGridColumn binding="marketPrice" header="Market Price" format="n2"/>
                <FlexGridColumn binding="chart" header="1-day Chart" width={100} format="n2"/>
                <FlexGridColumn binding="changes" header={changesTitle} format="n2"/>
            </FlexGrid>
        </div>;
    }
    async initializeGrid(flex) {
        this.flex = flex;
        flex.rowHeaders.columns[0].width = 80;
        flex.formatItem.addHandler((s, e) => {
            //
            // show symbols in row headers
            if (e.panel == s.rowHeaders && e.col == 0) {
                e.cell.textContent = item = s.rows[e.row].dataItem.symbol;
            }
            //
            // regular cells
            if (e.panel == s.cells) {
                var col = s.columns[e.col], item = s.rows[e.row].dataItem;
                //
                // store cell element
                if (!this._cellElements[item.symbol]) {
                    this._cellElements[item.symbol] = { item: item };
                }
                this._cellElements[item.symbol][col.binding] = e.cell;
                //
                // custom painting
                this._formatCell(e.cell, item, col, false);
            }
        });
        this._updateTrades();
    }
    async invalidateGrid() {
        await this._getData();
        this.flex.invalidate();
    }
    async _getData() {
        try {
            const response = await axios.get('http://localhost:5000/api/pricing');
            this.setState({
                data: response.data
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }
    // get a random number within a given interval
    _randBetween(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }
    // custom cell painting
    _formatCell(cell, item, col, flare) {
        switch (col.binding) {
            case 'chart':
                this._formatChartCell(cell, item, col, 'priceHistory', flare);
                break;
            case 'changes':
                this._formatPercentCell(cell, item, col, 'priceHistory', flare);
                break;
            case 'marketPrice':
                this._formatMarketCell(cell, item, col, 'priceHistory', flare);
                break;
            default:
                cell.textContent = Globalize.format(item[col.binding], col.format);
                break;
          }
    }
    _formatMarketCell(cell, item, col, history, flare) {
        let hist = this.state.itemPriceHistory[item.symbol];
        if (!hist || hist.length < 2) {
            hist = item[history];
        } 

        cell.textContent = Globalize.format(hist[hist.length - 1], col.format);
    }
    _formatChartCell(cell, item, col, history, flare) {
        // cell template
        let html = '<div class="ticker chg-{dir} flare-{fdir}"> ' +
            '<div class="spark">{spark}</div>' +
            '</div>';
        // % change
        let hist = this.state.itemPriceHistory[item.symbol];
        if (!hist || hist.length < 2) {
            hist = item[history];
        } 
        let chg = hist.length < this.state.interval * 60 ? hist[hist.length - 1] / hist[0] - 1 : hist[hist.length - 1] / hist[hist.length - this.state.interval * 60 - 1] - 1;

        // up/down glyph
        let glyph = chg > +0.001 ? 'up' : chg < -0.001 ? 'down' : 'circle';
        // change direction
        let dir = glyph == 'circle' ? 'none' : glyph;
        html = html.replace('{dir}', dir);
        // flare direction
        let flareDir = flare ? dir : 'none';
        html = html.replace('{fdir}', flareDir);

        // sparklines
        html = html.replace('{spark}', this._getSparklines(hist));
        // done
        cell.innerHTML = html;
    }
    _formatPercentCell(cell, item, col, history, flare) {
        // cell template
        let html = '<div class="ticker chg-{dir} flare-{fdir}"> ' +
            '<div class="glyph"><span class="wj-glyph-{glyph}"></span></div>' +
            '<div class="chg">{chg}</div>' +
            '</div>';
        // % change
        let hist = this.state.itemPriceHistory[item.symbol];
        if (!hist || hist.length < 2) {
            hist = item[history];
        }
        let chg = hist.length < this.state.interval * 60 ? hist[hist.length - 1] / hist[0] - 1 : hist[hist.length - 1] / hist[hist.length - this.state.interval * 60 - 1] - 1;
        html = html.replace('{chg}', Globalize.format(chg * 100, 'n1') + '%');

        // up/down glyph
        let glyph = chg > +0.001 ? 'up' : chg < -0.001 ? 'down' : 'circle';
        html = html.replace('{glyph}', glyph);
        // change direction
        let dir = glyph == 'circle' ? 'none' : glyph;
        html = html.replace('{dir}', dir);
        // flare direction
        let flareDir = flare ? dir : 'none';
        html = html.replace('{fdir}', flareDir);
        // done
        cell.innerHTML = html;
    }
    //
    // update grid cells when items change
    _updateGrid(changedItems) {
        for (let item in changedItems) {
            let itemCells = this._cellElements[item.symbol];
            if (itemCells) {
                // let item = changedItems[item.symbol];
                this.flex.columns.forEach((col) => {
                    let cell = itemCells[col.binding];
                    if (cell) {
                        this._formatCell(cell, item, col, true);
                    }
                });
            }
        }
    }
    async _updateTrades() {
        await this._getData();

        let changedItems = {};

        for (let i = 0; i < 10; i++) {
            // select an item
            let item = this.state.data[this._randBetween(0, this.state.data.length - 1)];
            // update current data
            if (item) {
                item.price = item.marketPrice * (1 + (Math.random() * .10 - .05));
                item.chart = item.price;
                // update history data
                let priceHistory = this.state.itemPriceHistory[item.symbol] || [];
                if (priceHistory) {
                    item.priceHistory = priceHistory;
                }
                this._addHistory(item.priceHistory, item.chart);
                priceHistory = item.priceHistory;
                let itemPriceHistory = this.state.itemPriceHistory;
                itemPriceHistory[item.symbol] = priceHistory;
                this.setState({
                    itemPriceHistory: itemPriceHistory
                });

                //
                // keep track of changed items
                changedItems[item.symbol] = item;
            }
        }

        //
        // update the grid
        this._updateGrid(changedItems);
        //
        // and schedule the next batch
        setTimeout(this._updateTrades.bind(this), 1000);
    }
    // add a value to a history array
    _addHistory(array, data) {
        array.push(data);
        if (array.length > 3600) { // limit history length
            array.splice(0, 1);
        }
    }
    // generate sparklines as SVG
    _getSparklines(data) {
        let sub = data.length > 10 ? data.slice(data.length - 11, data.length - 1): data;
        let svg = '', min = Math.min.apply(Math, sub), max = Math.max.apply(Math, sub), x1 = 0, y1 = this._scaleY(sub[0], min, max);
        for (let i = 1; i < sub.length; i++) {
            let x2 = Math.round((i) / (sub.length - 1) * 100);
            let y2 = this._scaleY(sub[i], min, max);
            svg += '<line x1=' + x1 + '% y1=' + y1 + '% x2=' + x2 + '% y2=' + y2 + '% />';
            x1 = x2;
            y1 = y2;
        }
            
        return '<svg><g>' + svg + '</g></svg>';
    }
    _scaleY(value, min, max) {
        return max > min ? 100 - Math.round((value - min) / (max - min) * 100) : 0;
    }

    intervalItemsChange(s, e) {
        this.setState({
            interval: s.selectedValue
        });
    }
}
setTimeout(() => {
    const container = document.getElementById('app');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
    }
}, 1000);
