import { LightningElement, track, api, wire } from 'lwc';
import { getRecord } from 'lightning/uiRecordApi';
import getArticles from '@salesforce/apex/FetchNews.fetchNewsArticles';
import createChatterPost from '@salesforce/apex/chatterPost.createChatterPostFromArticle';



const FIELDS = [
    'Account.Name'
];

const fromOptions = [
    {label: 'Today', value: '0'},
    {label: 'Last 7 Days', value: '7'},
    {label: 'Last Month', value: '30'}];

const maxArticlesOptions = [
    {label: '3', value: '3'},
    {label: '5', value: '5'},
    {label: '10', value: '10'}];

const nameInTitleOptions = [
    {label: 'Yes', value: 'Yes'},
    {label: 'No', value: 'No'}];

export default class customLWC extends LightningElement {
    
    @api recordId;
    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    account;
    @track fromOptionvalue;
    @track maxNumArticles;
    @track wantNameInTitle;
    @track chatterArticleNum;
    @track resultArticles;
    @track today = new Date()//.toISOString().split('T')[0];
    @track fromOptions = fromOptions;
    @track maxArticlesOptions = maxArticlesOptions;
    @track nameInTitleOptions = nameInTitleOptions;

    get accountName() {
        return this.account.data.fields.Name.value;
    }

    handleFromOption(event) {
        this.fromOptionvalue = parseInt(event.detail.value);
    }

    handleMaxNumArticlesOption(event){
        this.maxNumArticles = parseInt(event.detail.value);
    }

    handleWantNameInTitle(event){
        this.wantNameInTitle = event.detail.value;
    }

    handleArticleToChatter(event){
        this.chatterArticleNum = event.target.value;
    }


    getNews = () => {
        window.console.log(this.fromOptionvalue);
        let searchDate = new Date();
        searchDate.setDate(searchDate.getDate()-this.fromOptionvalue)//.toISOString().split('T')[0];
        searchDate = searchDate.toISOString().split('T')[0];

        let endpointURL = 'https://newsapi.org/v2/everything?q='
                            +this.account.data.fields.Name.value
                            +'&from='+searchDate
                            +'&sortBy=popularity&apiKey=57a58e3a964a4abf9c445611c42900de';
        
        window.console.log(endpointURL);
        getArticles({strEndPointURL: endpointURL})
        .then(data => {
            let articles;
            if (data.length < this.maxNumArticles){
                articles = data;
            }else{
                if (this.wantNameInTitle === 'Yes'){
                    articles = [];
                    for (var i = 0; i < data.length; i++){
                        if (data[i]["title"].includes(this.account.data.fields.Name.value)){
                            articles.push(data[i]);
                            if (articles.length === this.maxNumArticles){break}
                        }
                    }
                }else{
                    articles = data.slice(0,this.maxNumArticles);
                }
            }
            window.console.log('result----------------');
            window.console.log('result ====>'+JSON.stringify(articles));
            this.resultArticles = articles;
        })
        .catch(error => {
            window.console.log('callout error ===> '+JSON.stringify(error));
        })
    };    

    createPost = () => {
        const articleToBeSent = this.resultArticles[parseInt(this.chatterArticleNum)-1] 
        // window.console.log(this.recordId);
        createChatterPost(articleToBeSent["title"], 
                                    articleToBeSent["description"], 
                                    articleToBeSent["url"], 
                                    this.recordId,
                                    this.account.data.fields.Name.value)
        .then(() => {
            window.console.log('yay');
        })
        .catch(error => {
            window.console.log('callout error ===> '+JSON.stringify(error));
        })
        
    }

}