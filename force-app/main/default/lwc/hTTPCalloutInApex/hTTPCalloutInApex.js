import { LightningElement, track} from 'lwc';

// importing apex class to make callout
import getCurrencyData from '@salesforce/apex/CurrencyConversionController.retriveCurrencyConversionRates';

// Currency options
const options = [
                { label: 'USD', value: 'USD' },
                { label: 'EUR', value: 'EUR' },
                { label: 'CAD', value: 'CAD' },
                { label: 'GBP', value: 'GBP' },
                { label: 'INR', value: 'INR' }];

export default class HTTPCalloutInApex extends LightningElement {
    @track fromCurrencyValue;
    @track toCurrencyValue;
    @track options = options;
    @track toCurrencyOptions = options;
    @track conversionData;
    
    // Getting Base currency value
    handleFromCurrencyChange(event) {
        this.fromCurrencyValue = event.detail.value;
    }

    // getting exchange currency value
    handleToCurrencyChange(event) {
        this.toCurrencyValue = event.detail.value;
    }

    // Making Callout using apex class
    handleCurrencyConversion() {
        // endpoint URL
        let endpointURL = 'https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=' 
                                + this.fromCurrencyValue + '&to_currency=' + this.toCurrencyValue + '&apikey=4W7NZUQNJ061YHHF';
        
        // calling apex class method to make callout
        getCurrencyData({strEndPointURL : endpointURL})
        .then(data => {
        
            let objData = {
                From_Currency_Name : '',
                From_Currency_Code : '',
                To_Currency_Name : '',
                To_Currency_Code : '',
                Exchange_Rate : '',
                Last_Refersed : '',
            };

            window.console.log('jsonResponse ===> '+JSON.stringify(data));
            // retriving the response data
            let exchangeData = data['Realtime Currency Exchange Rate'];

            // adding data object
            objData.From_Currency_Code = exchangeData['1. From_Currency Code'];
            objData.From_Currency_Name = exchangeData['2. From_Currency Name'];
            objData.To_Currency_Code = exchangeData['3. To_Currency Code'];
            objData.To_Currency_Name = exchangeData['4. To_Currency Name'];
            objData.Exchange_Rate = exchangeData['5. Exchange Rate'];
            objData.Last_Refershed = exchangeData['6. Last Refreshed'];

            // adding data object to show in UI
            this.conversionData = objData;
        })
        .catch(error => {
            window.console.log('error ====> '+JSON.stringify(error));
        })

    } 

}