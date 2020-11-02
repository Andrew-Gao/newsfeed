import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Typography, Input, Image, Button } from 'antd';
import { imageUrl } from './noimage.json';


const { Title, Link } = Typography;
const { Search } = Input;

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles : [{title: ""}],
            currentCategory: "",
            searched : "",
            cardsOnDisplay : []
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    constructCards(){
        const gridStyle = {
            width: '329px',
            height: '850px',
            textAlign: 'center',
            backgroundColor: 'black',
            color: 'white',
            marginRight: '10px',
            marginLeft: '10px',
            marginBottom: '100px',
          };
        let cardArray = []
        for (let i = 0; i < this.state.articles.length; i++){
            cardArray.push(
            <Card.Grid style={gridStyle}>
                <Image
                    fallback = {imageUrl}
                    width={'97%'}
                    height={'200px'}
                    src = {this.state.articles[i].urlToImage}
                    style = {{marginBottom: "50px"}}
                />
                <br/>
                <Title style = {{textAlign: "left", fontSize : 25, color : "white"}}>{this.state.articles[i].title.toUpperCase()}</Title>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : "white"}}>{this.state.articles[i].author}</Title>
                <br/>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : "white"}}>{this.state.articles[i].description}</Title>
                <br/>
                <Button block ghost = {true} onClick = {() => {this.openInNewTab(this.state.articles[i].url)}}>Read More</Button>
            </Card.Grid>
            )
        }
        this.setState({cardsOnDisplay : cardArray})
    }

    //From https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
    openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    handleChange(e){
        this.setState({searched : e.target.value})
    }

    async handleSubmit(){
        var url = 'http://newsapi.org/v2/everything?' +
          `q=${this.state.searched} AND (Technology OR Entertainment OR Sports)&` +
          'from=2020-01-00&' +
          'pageSize=100&' +
          'sortBy=popularity&' +
          'apiKey=68716d4f70494bcf9345d6d183c0c836';
        console.log(url)
        var req = new Request(url);
        const response = await fetch(req);
        const body = await response.json()
        this.setState({ articles : body.articles.slice(0,100)})
        this.constructCards();
    }


    render(){
        const mainCards = 
        <div>
            <Card title={this.state.currentCategory} style = {{textAlign : "center", width : "1400px", marginLeft : "auto", marginRight: "auto", border: "none"}}>
                {this.state.cardsOnDisplay}
            </Card>
        </div>
        return (
            <div>
                <div className="App" style = {{textAlign: "center", marginBottom: "50px"}}>
                    <br></br>
                    <Title style = {{fontSize : 60}}>Newsfeed</Title>
                    <Search style={{ width: 200, margin: '0 10px' }} placeholder="Search Newsfeed" onChange = {this.handleChange} onPressEnter = {this.handleSubmit} onSearch = {this.handleSubmit} enterButton />
                    <br></br>
                </div>
                {mainCards}
            </div>
        )
    }
}
