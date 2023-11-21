import 'bootstrap.css';
import '@grapecity/wijmo.styles/wijmo.css';
import './app.css';
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import axios from 'axios';
import { FlexGrid, FlexGridColumn } from '@grapecity/wijmo.react.grid';
import { Globalize } from '@grapecity/wijmo';

class App extends React.Component {
    constructor(props) {
        super(props);
        this._cellElements = {};
        this.state = {
            data: [],
            itemPriceHistory: {},
        };
        this.initializeGrid = this.initializeGrid.bind(this);
    }

    render() {
        return <div className="container-fluid">
            <h2>Pricing Data</h2>
            <FlexGrid isReadOnly={true} selectionMode="Row" initialized={this.initializeGrid} itemsSource={this.state.data}>
                <FlexGridColumn binding="name" header="Event Name" width={200}/>
                <FlexGridColumn binding="eventDate" header="Event Date" format="hh:mm:ss mm/dd/yyyy" align="center"/>
                <FlexGridColumn binding="marketPrice" header="Market Price" format="n0"/>
                <FlexGridColumn binding="chart" header="1-day Chart" width={100} format="n2"/>
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
                this._formatDynamicCell(cell, item, col, 'priceHistory', flare);
              break;
            default:
                cell.textContent = Globalize.format(item[col.binding], col.format);
                break;
          }
    }
    _formatDynamicCell(cell, item, col, history, flare) {
        // cell template
        let html = '<div class="ticker chg-{dir} flare-{fdir}"> ' +
            '<div class="spark">{spark}</div>' +
            '</div>';
        // % change
        let hist = this.state.itemPriceHistory[item.symbol];
        if (!hist || hist.length < 2) {
            hist = item[history];
        } 
        // sparklines
        html = html.replace('{spark}', this._getSparklines(hist));
        // done
        cell.innerHTML = html;
    }
    //
    // update grid cells when items change
    _updateGrid(changedItems) {
        for (let symbol in changedItems) {
            let itemCells = this._cellElements[symbol];
            if (itemCells) {
                let item = itemCells.item;
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

        for (let i = 0; i < 50; i++) {
            // select an item
            let item = this.state.data[this._randBetween(0, this.state.data.length - 1)];
            // update current data
            if (item) {
                item.chart = item.chart * (1 + (Math.random() * .10 - .05));
                item.priceSize = this._randBetween(10, 1000);
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
                changedItems[item.symbol] = true;
            }
        }

        //
        // update the grid
        this._updateGrid(changedItems);
        //
        // and schedule the next batch
        setTimeout(this._updateTrades.bind(this), 100);
    }
    // add a value to a history array
    _addHistory(array, data) {
        array.push(data);
        if (array.length > 10) { // limit history length
            array.splice(0, 1);
        }
    }
    // generate sparklines as SVG
    _getSparklines(data) {
        let svg = '', min = Math.min.apply(Math, data), max = Math.max.apply(Math, data), x1 = 0, y1 = this._scaleY(data[0], min, max);
        for (let i = 1; i < data.length; i++) {
            let x2 = Math.round((i) / (data.length - 1) * 100);
            let y2 = this._scaleY(data[i], min, max);
            svg += '<line x1=' + x1 + '% y1=' + y1 + '% x2=' + x2 + '% y2=' + y2 + '% />';
            x1 = x2;
            y1 = y2;
        }
        return '<svg><g>' + svg + '</g></svg>';
    }
    _scaleY(value, min, max) {
        return max > min ? 100 - Math.round((value - min) / (max - min) * 100) : 0;
    }
}
setTimeout(() => {
    const container = document.getElementById('app');
    if (container) {
        const root = ReactDOM.createRoot(container);
        root.render(<App />);
    }
}, 10);
