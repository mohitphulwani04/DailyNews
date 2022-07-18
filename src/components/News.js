import React, { Component } from 'react'
import NewsItem from './NewsItem'
import SpinnerLoaderr from './SpinnerLoaderr';
import PropTypes from 'prop-types'
//import { toHaveDisplayValue } from '@testing-library/jest-dom/dist/matchers';


export class News extends Component {

    static defaultProps = {
        country: 'in',
        pageSize: 9,
        category: 'business'
    }

    capitalizeFirstLetter = (string) =>{
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    static propsTypes = {
        country: PropTypes.string,
        pageSize: PropTypes.number,
        category: PropTypes.string
    }

    constructor(props){
        super(props);
        console.log('Hello i am cosnstructor from news component');
        this.state = {
            articles: [],
            page: 1,
            loading: false
        }
        document.title = `${this.capitalizeFirstLetter(this.props.category)} - DailyNews`;
    }

    async updateNews(){
        const url = `https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=be7cbcd6d44f4641995e33648b8c00d3&page=${this.state.page}&pageSize=${this.props.pageSize}`;
        this.setState({loading: true });
        let data = await fetch(url);
        let parseData = await data.json();
        this.setState({
            articles: parseData.articles,
            totalResults: parseData.totalResults,
            loading: false
         })
        console.log(parseData);
    }

    async componentDidMount(){
       this.updateNews();

    }

    handlePrevClick = async ()=>{
        console.log("PREV");
        
        this.setState({
            page: this.state.page-1 
        });
        this.updateNews();
    }
    
    handleNextClick = async ()=>{
        console.log("NEXT");
        if(this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)){
        }else{
            this.setState({
                page: this.state.page+1
             });
             this.updateNews();

        }

    }

    
    
  render() {
    return (
      <div className="container my-3 " >
        <h1 className='text-center' style={{width: '35px 0px'}} > DailyNews - Top {this.capitalizeFirstLetter(this.props.category)} Headlines </h1>
        {this.state.loading && <SpinnerLoaderr/>}
        <div className="row ">
            {!this.state.loading && this.state.articles.map((element) => {
                return <div className="col-md-4" key={element.url}>
                    <NewsItem title={element.title?element.title.slice(0,45):" "} description={element.description?element.description.slice(0,88):" "} 
                    imageUrl= {element.urlToImage} newsUrl= {element.url} author={element.author} date={element.publishedAt} source={element.source.name}/>
                </div>
            })}
        </div>
        <div className="container d-flex justify-content-between">
            <button disabled={this.state.page<=1} type="button" className="btn btn-dark" onClick={this.handlePrevClick}>&larr; PREVIOUS</button>
            <button disabled={this.state.page+1 > Math.ceil(this.state.totalResults/this.props.pageSize)} type="button" className="btn btn-danger" onClick={this.handleNextClick}>NEXT &rarr;</button>
        </div>
    </div>
    )
  }
}

export default News
