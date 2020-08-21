import React, {Component} from 'react';
import './App.css';
import Plot from 'react-plotly.js';


class App extends Component{
  constructor(){
    super();
    this.state = {equityName: "", timeSeries: "", interval:"", outputSize:"compact", x_val: [], open: [], high: [], low: [], close: []}
    this.updateGraph = this.updateGraph.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event){
    const {name, value} = event.target
    this.setState({
      [name]: value
    })
  }

  componentDidMount(){
    this.updateGraph();
  }

  updateGraph(){
    if(this.state.equityName !== "" && this.state.timeSeries !== ""){
      if(this.state.timeSeries === "TIME_SERIES_INTRADAY" && this.state.interval === "") return;
      let url;
      let timeSeries
      if(this.state.timeSeries === "TIME_SERIES_INTRADAY"){
        url = "https://alpha-vantage.p.rapidapi.com/query?datatype=json&output_size="+this.state.outputSize+"&interval="+this.state.interval+"&function=TIME_SERIES_INTRADAY&symbol="+this.state.equityName;
        timeSeries = 'Time Series ('+this.state.interval+')';
      }
      else if(this.state.timeSeries === "TIME_SERIES_DAILY"){
        url = "https://alpha-vantage.p.rapidapi.com/query?outputsize="+this.state.outputSize+"&datatype=json&function=TIME_SERIES_DAILY_ADJUSTED&symbol="+this.state.equityName;
        timeSeries = 'Time Series (Daily)';
      }
      else if(this.state.timeSeries === "TIME_SERIES_WEEKLY"){
        url = "https://alpha-vantage.p.rapidapi.com/query?datatype=json&function=TIME_SERIES_WEEKLY_ADJUSTED&symbol="+this.state.equityName;
        timeSeries = "Weekly Adjusted Time Series";
      }
      else{
        url = "https://alpha-vantage.p.rapidapi.com/query?datatype=json&symbol="+this.state.equityName+"&function=TIME_SERIES_MONTHLY_ADJUSTED";
        timeSeries = "Monthly Adjusted Time Series"
      }
  
      fetch(url, {
        "method": "GET",
        "headers": {
        "x-rapidapi-host": "alpha-vantage.p.rapidapi.com",
        "x-rapidapi-key": "230d86db60msheb2e40d44790598p1915e2jsn5074c9944675"
        }
      })
        .then(response => response.json())
        .then(data => {
          console.log(data)
          let x_array = []
          let open_array = []
          let high_array = []
          let low_array = []
          let close_array = []
          for(var key in data[timeSeries]){
            x_array.push(key)
            open_array.push(data[timeSeries][key]['1. open'])
            high_array.push(data[timeSeries][key]['2. high'])
            low_array.push(data[timeSeries][key]['3. low'])
            close_array.push(data[timeSeries][key]['4. close'])
          }
          this.setState({x_val: x_array, open: open_array, high: high_array, low: low_array, close: close_array})
        })
    }
  }

  render(){
    return(
      <div>
        <div>
          <form>
            <input name="equityName" type="text" onChange={this.handleChange} value={this.state.equityName} 
            placeholder="Type Equity Name"/>
            <select name="timeSeries" value={this.state.timeSeries} onChange={this.handleChange}>
              <option value="">-- Please select a time series --</option>
              <option value="TIME_SERIES_INTRADAY">Intraday</option>
              <option value="TIME_SERIES_DAILY">Daily</option>
              <option value="TIME_SERIES_WEEKLY">Weekly</option>
              <option value="TIME_SERIES_MONTHLY">Monthly</option>
            </select>
          </form>

          {this.state.timeSeries === "TIME_SERIES_INTRADAY" && 
          <select name="interval" value={this.state.interval} onChange={this.handleChange}>
            <option value="">-- Please select a time interval --</option>
            <option value="1min">1min</option>
            <option value="5min">5min</option>
            <option value="15min">15min</option>
            <option value="30min">30min</option>
            <option value="60min">60min</option>
          </select>}

        {/*(this.state.timeSeries === "TIME_SERIES_DAILY" || this.state.timeSeries == "TIME_SERIES_INTRADAY") &&
          <div> 
            <label style={{color: "white"}}>
              Compact
              <input name="outputSize" type="radio" value="compact" checked={this.state.outputSize === "compact"} onChange={this.handleChange}/>
            </label>
            <label style={{color: "white"}}>
              Full 
              <input name="outputSize" type="radio" value="full" checked={this.state.outputSize === "full"} onChange={this.handleChange}/>
            </label>
          </div>*/}

          <button onClick={this.updateGraph}>Submit</button>
        </div>
        <Plot className="plot"
        data={[
          {
            x: this.state.x_val,
            open: this.state.open,
            high: this.state.high,
            low: this.state.low,
            close: this.state.close,
            type: 'candlestick',
            mode: 'lines+markers',
            marker: {color: 'red'},
          },
        ]}
        layout={ {width: 1500, height: 1000, title: this.state.equityName} }
        />
      </div>
    )
  }
}

export default App;
