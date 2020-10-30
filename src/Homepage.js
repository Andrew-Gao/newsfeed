import React, { Component } from "react";
import "antd/dist/antd.css";
import { Button } from 'antd';
import { Card } from 'antd';
import { Typography } from 'antd';
import { Input } from 'antd';

const { Title, Link } = Typography;
const { Search } = Input;

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles : [{title: ""}],
            currentCategory: "",
            cardsOnDisplay : []
        }
        this.handleClick = this.handleClick.bind(this);
    }

    constructCards(){
        const gridStyle = {
            width: '25%',
            height: '300px',
            textAlign: 'center',
          };
        let cardArray = []
        for (let i = 0; i < this.state.articles.length; i++){
            cardArray.push(
            <Card.Grid style={gridStyle}>
                {this.state.articles[i].title}
                {this.state.articles[i].author}
                {this.state.articles[i].description}
                
                {<Link href = {this.state.articles[i].url}>
                    Read more
                </Link>}
            </Card.Grid>
            )
        }
        this.setState({cardsOnDisplay : cardArray})
    }

    async handleClick(id){
        let searchTopic = "";
        if(id == 1){
            searchTopic = "Entertainment";
        }
        else if(id == 2){
            searchTopic = "Sports"
        }
        else if(id == 3){
            searchTopic = "Technology"
        }
        this.setState({currentCategory : searchTopic})
        var url = 'http://newsapi.org/v2/everything?' +
          `q=${searchTopic}&` +
          'from=2020-10-00&' +
          'sortBy=popularity&' +
          'apiKey=68716d4f70494bcf9345d6d183c0c836';
        var req = new Request(url);
        const response = await fetch(req);
        const body = await response.json()
        console.log(body.articles[0].description)
        this.setState({ articles : body.articles.slice(0,100)})
        this.constructCards();
    }

    render(){
        return (
            <div>
                <div className="App" style = {{textAlign: "center", marginBottom: "50px"}}>
                    <Title style = {{fontSize : 60}}>Newsfeed</Title>
                        <Search style={{ width: 200, margin: '0 10px' }} placeholder="input search text" onSearch={() => console.log("search")} enterButton />
                        <br></br>
                        <br></br>
                        {/* <Button onClick = {() => this.handleClick(1)}>Entertainment</Button>
                        <Button onClick = {() => this.handleClick(2)}>Sports</Button>
                        <Button onClick = {() => this.handleClick(3)}>Technology</Button> */}
                </div>
                <div>
                    <Card title={this.state.currentCategory} style = {{textAlign : "center"}}>
                        {this.state.cardsOnDisplay}
                    </Card>
                </div>
            </div>
        )
    }
}
