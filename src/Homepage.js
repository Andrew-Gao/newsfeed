import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Typography, Input, Image, Button } from 'antd';
import { imageUrl } from './noimage.json';
import { BackTop } from 'antd';


const { Title } = Typography;
const { Search } = Input;

//You need to:
//Figure out the image response code thing (wait for grants response)
//add in error handling for a bad response 

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles : [{title: ""}],
            searched : "",
            cardsOnDisplay : [],
            noResult: false
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

   async constructCards(){
        //styling for individual cards
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
        if (this.state.articles.length === 0){   // this is the case in which nothing gets returned from the search
            this.setState({noResult: true})
        }
        for (let i = 0; i < this.state.articles.length; i++){
            
            const author = this.state.articles[i].author == null ? "" : this.state.articles[i].author  // In case the author is null, we don't want the word "null"
            const title = this.state.articles[i].title.length > 100 ? this.state.articles[i].title.substring(0,100) + "..." : this.state.articles[i].title //Title being too long causes formatting issues 
            const image = 
            this.state.articles[i].urlToImage != null? 
            <Image
                fallback = {imageUrl}
                height={'180px'}
                src = {this.state.articles[i].urlToImage}
                style = {{marginBottom: "50px"}}
            /> :
            <Image 
                src = {imageUrl} 
                height={'180px'} 
                style = {{marginBottom: "50px"}}
            />
            cardArray.push(
            <Card.Grid style = {gridStyle} >
                {image}
                <br/>
                <Title style = {{textAlign: "left", fontSize : 25, color : "white"}}>{title.toUpperCase()}</Title>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : "white"}}>{author + " | " + this.state.articles[i].source.name}</Title>
                <Title level = {5} style = {{textAlign: "left", fontSize : 13, color : "white"}}>{this.state.articles[i].publishedAt.substring(0,10)}</Title>
                <br/>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : "white"}}>{this.state.articles[i].description}</Title>
                <br/>
                <Button block ghost = {true} onClick = {() => {this.openInNewTab(this.state.articles[i].url)}}>Read More</Button>
            </Card.Grid>
            )
        }
        this.setState({cardsOnDisplay : cardArray})
    }

    async componentDidMount(){
        var url = 'http://newsapi.org/v2/everything?' +
        `q=Technology OR Entertainment OR Sports&` +
        'from=2020-01-00&' +
        'pageSize=100&' +
        'sortBy=popularity&' +
        'apiKey=78b9d599c4f94f8fa3afb1a5458928d6';
        var req = new Request(url);
        const response = await fetch(req);
        if(response.ok){
            const body = await response.json()
            this.setState({ articles : body.articles.slice(0,100)}) 
            this.constructCards(); //constructs the main news display grid based off the search results 
        } else {
            throw Error("Error fetching data resulted in response code " + response.status)
        } 
    }

    //From https://stackoverflow.com/questions/45046030/maintaining-href-open-in-new-tab-with-an-onclick-handler-in-react
    //Opens a link in a new tab
    openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    //Updates the stateful variable searched to match whatever the user enters
    handleChange(e){
        this.setState({searched : e.target.value})
    }

    //sends get request to the News API when user clicks the search button or hits enter
    async handleSubmit(){
        const url = 'http://newsapi.org/v2/everything?' +
          `q=${this.state.searched} AND (Technology OR Entertainment OR Sports)&` +
          'from=2020-01-00&' +
          'pageSize=100&' +
          'sortBy=popularity&' +
          'apiKey=78b9d599c4f94f8fa3afb1a5458928d6';
        var req = new Request(url);
        const response = await fetch(req);
        const body = await response.json()
        this.setState({ articles : body.articles.slice(0,100), noResult: false}) //Sets the stateful articles array to the first 100 articles returned 
        this.constructCards(); //constructs the main news display grid based off the search results
    }

    render(){
        //Styling for the back to the top button
        const backTopStyle = {
            height: 40,
            width: 100,
            lineHeight: '40px',
            backgroundColor: 'black',
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontSize: 14,
          };
        
          //Main search results displayed in a card grid form
        const mainCards = 
        <div>
            <Card style = {{textAlign : "center", width : "1400px", marginLeft : "auto", marginRight: "auto", border: "none"}}>
                {this.state.cardsOnDisplay}
            </Card>
            <BackTop>
                <div style={backTopStyle}>Back to Top</div>
            </BackTop>
        </div>

        //This gets displayed if the search returns nothing
        const ifNoResults = 
        <div>
            <Title style = {{textAlign: "center", fontSize : 20}}>Sorry, no results were found</Title>
        </div>

        return (
            <div>
                <div className="App" style = {{display: 'flex', alignItems: "baseline"}}>
                    <br></br>
                    <Title onClick = {() => {window.location.reload()}} style = {{marginLeft: '10px', fontSize : 60}}>Newsfeed</Title>
                    <Title style = {{marginLeft: '30px', width: '60%', fontSize : 20}}>Your home for entertainment, sports, and tech articles</Title>
                    <Search style={{width: 200, marginTop: '21px', marginLeft: "10px"}} placeholder="Search Newsfeed" onChange = {this.handleChange} onPressEnter = {this.handleSubmit} onSearch = {this.handleSubmit} enterButton />
                    <hr></hr>
                </div>
                <div style = {{marginTop: '30px'}}>
                    {this.state.noResult? ifNoResults : mainCards}
                </div>
            </div>
        )
    }
}


