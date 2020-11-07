import React, { Component } from "react";
import "antd/dist/antd.css";
import { Card, Typography, Input, Image, Button } from 'antd';
import { imageUrl } from './noimage.json'; //url of the fallback image imported from json file
import { BackTop } from 'antd';


const { Title } = Typography;
const { Search } = Input;

export default class Homepage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            articles : [{title: ""}],
            searched : "",
            cardsOnDisplay : [],
            noResult: false,
            currentCategory: ""
        }
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCategoryChange = this.handleCategoryChange.bind(this);
    }

    /**
     * Constructs the main news grid once every time 
     * data is fetched from the API
     */
   async constructCards(){
        //styling for individual cards
        const gridStyle = {
            width: '329px',
            height: '850px',
            textAlign: 'center',
            backgroundColor: "black",
            color: '#FDF5E6',
            marginRight: '10px',
            marginLeft: '10px',
            marginBottom: '100px',
          };
        let cardArray = []
        for (let i = 0; i < this.state.articles.length; i++){
            let author = ""
            const authorIsNull = this.state.articles[i].author == null ? true : false  // In case the author is null, we don't want the word "null"
            //Author being too long causes formatting issues, cut it at 100 characters
            if(!authorIsNull){
                author = this.state.articles[i].author.length > 100? this.state.articles[i].author.substring(0,100) + "..." : this.state.articles[i].author
            }
            //Title being too long causes formatting issues as well
            let title = ""
            if(this.state.articles[i].title != null){
                title = this.state.articles[i].title.length > 100 ? this.state.articles[i].title.substring(0,100) + "..." : this.state.articles[i].title  
            }
            //In case there is no image, set the image to the default fallback option
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
            <Card.Grid style = {gridStyle}>
                {image}
                <br/>
                <Title style = {{textAlign: "left", fontSize : 25, color : '#FDF5E6'}}>{title.toUpperCase()}</Title>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : '#FDF5E6'}}>{author + " | " + this.state.articles[i].source.name}</Title>
                <Title level = {5} style = {{textAlign: "left", fontSize : 13, color : '#FDF5E6'}}>{this.state.articles[i].publishedAt.substring(0,10)}</Title>
                <br/>
                <Title level = {5} style = {{textAlign: "left", fontSize : 15, color : '#FDF5E6'}}>{this.state.articles[i].description}</Title>
                <br/>
                <Button ghost = {true} block onClick = {() => {this.openInNewTab(this.state.articles[i].url)}}>Read More</Button>
            </Card.Grid>
            )
        }
        this.setState({cardsOnDisplay : cardArray})
    }

    /**
     * Upon first landing on the website, we want to display the most popular articles
     * from all three categories
     */
    async componentDidMount(){
        var url = 'https://newsapi.org/v2/everything?' +
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

    /**
     * Changes the current category we're searching in depending on which button the user presses
     * @param {*} e : the id of the button that the user presses, {1, 2, 3}
     */
    async handleCategoryChange(e){
        if(e == 1){
            this.setState({currentCategory: "Entertainment"}, this.handleSubmit)
        } else if(e == 2){
            this.setState({currentCategory: "Technology"}, this.handleSubmit)
        } else if(e == 3){
            this.setState({currentCategory: "Sports"}, this.handleSubmit)
        }
    }

    /**
     * Updates the stateful variable searched to match whatever the user enters
     * @param {*} e : the user input
     */
    handleChange(e){
        this.setState({searched : e.target.value})
    }

    /**
     * Sends a get request to 
     * the News API when user clicks on the search button
     * or presses enter
     */
    async handleSubmit(){
        let searchLine = "" //What category and input we want to search for
        if(this.state.searched == "" && this.state.currentCategory != ""){
            searchLine = this.state.currentCategory
        } else if(this.state.currentCategory == "" && this.state.searched != ""){
            searchLine = this.state.searched
        } else if(this.state.currentCategory == "" && this.state.searched == ""){
            searchLine = 'Technology OR Entertainment OR Sports'
        } else{
            searchLine = `${this.state.searched} AND ${this.state.currentCategory}`
        }
        const url = 'https://newsapi.org/v2/everything?' +
          `q=${searchLine}&` +
          'from=2020-01-00&' +
          'pageSize=100&' +
          'sortBy=popularity&' +
          'apiKey=78b9d599c4f94f8fa3afb1a5458928d6';
        var req = new Request(url);
        const response = await fetch(req);
        if (response.ok){
            const body = await response.json()
            //In the case that the search resulted in nothing
            if(body.articles == null){
                this.setState({noResult : true})
                return
            } else {
                this.setState({ articles : body.articles, noResult: false}) 
            } 
            this.constructCards(); //constructs the main news display grid based off the search results
        } else {
            throw Error("Error fetching data resulted in response code " + response.status)
        }
    }

    render(){
        //Styling for the back to the top button
        const backTopStyle = {
            height: 40,
            width: 100,
            lineHeight: '40px',
            background: "black",
            color: '#fff',
            textAlign: 'center',
            borderRadius: '4px',
            fontSize: 14,
          };
        
        //Main search results displayed in a card grid form
        const mainCards = 
        <div>
            <Card style = {{background: '#white', textAlign : "center", width : "1400px", marginLeft : "auto", marginRight: "auto", border: "none"}}>
                {this.state.cardsOnDisplay}
            </Card>
        </div>

        //This gets displayed if the search returns nothing
        const ifNoResults = 
        <div>
            <Title style = {{textAlign: "center", fontSize : 20}}>Sorry, no results were found</Title>
        </div>

        return (
            <div style = {{background: 'white'}}>
                <div className="App" style = {{background: 'white', display: 'flex', alignItems: "center", height: "85px", marginTop: "25px"}}>
                    <br></br>
                    <Title onClick = {() => {window.location.reload()}} style = {{marginLeft: '30px', fontSize : 60, color: "#4682B4"}}>Newsfeed</Title>
                    <Title style = {{marginBottom: "25px", marginLeft: '30px', width: '45%', fontSize : 20}}>Your home for entertainment, sports, and tech articles</Title>
                    <Button style = {{width: "125px"}} block onClick = {() => {this.handleCategoryChange(1)}}>Entertainment</Button>
                    <Button style = {{width: "125px"}} block onClick = {() => {this.handleCategoryChange(2)}}>Technology</Button>
                    <Button style = {{width: "125px"}} block onClick = {() => {this.handleCategoryChange(3)}}>Sports</Button>
                    <Search style={{width: 200, marginTop: '21px', marginLeft: "30px", marginBottom: "23px"}} placeholder="Search Newsfeed" onChange = {this.handleChange} onPressEnter = {this.handleSubmit} onSearch = {this.handleSubmit} enterButton />
                </div>
                <hr></hr>
                <div style = {{marginTop: '30px'}}>
                    {this.state.noResult? ifNoResults : mainCards} 
                </div>
                <BackTop>
                    <div style={backTopStyle}>Back to Top</div>
                </BackTop>
            </div>
        )
    }
}


