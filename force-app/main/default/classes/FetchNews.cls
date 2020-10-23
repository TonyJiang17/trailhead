public inherited sharing class FetchNews {

    @AuraEnabled
    public static List<Object> fetchNewsArticles(String strEndPointURL){
        map<String, Object> response = new map<String, Object>();
        List<Object> articles = new List<Object>();
        String strResponse = null;
        if(String.isNotBlank(strEndPointURL)) {
            HttpRequest httpRequest = new HttpRequest();  
            httpRequest.setEndpoint(strEndPointURL);

            httpRequest.setMethod('GET');   
            httpRequest.setHeader('Authorization', 'OAuth ' + UserInfo.getSessionId());        
            httpRequest.setHeader('Authorization', 'Bearer ' + UserInfo.getSessionId()); 
            
            try {  
                Http http = new Http();   
                HttpResponse httpResponse = http.send(httpRequest);  

                while(httpResponse.getStatusCode() == 302) {
                    httpRequest.setEndpoint(httpResponse.getHeader('Location'));
                    httpResponse = new Http().send(httpRequest);
                }

                if (httpResponse.getStatusCode() == 200 ) {  
                    strResponse = httpResponse.getBody();  
                } 
                else {  
                    throw new CalloutException(httpResponse.getBody());  
                }   
            } 
            catch(Exception ex) {  
                throw ex;  
            }  
        } 

        if(!String.isBlank(strResponse)) {
            response = (map<String, Object>)JSON.deserializeUntyped(strResponse);
            articles = (List<Object>)response.get('articles');
            System.debug('mapJsonData ===> '+articles);
        }

        if(articles.size() > 0) {
            return articles;
        }
        else {
            return null;
        }
    }
}