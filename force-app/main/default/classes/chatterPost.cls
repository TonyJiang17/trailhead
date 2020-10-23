public inherited sharing class chatterPost {
    @AuraEnabled
    public static void createChatterPostFromArticle(String title, String description, String url, String accountRecordId, String accountName){
        try {  
            FeedItem post = new FeedItem();
            post.ParentId = accountRecordId;
            // post.Body = 'Check out this new Article about' + accountName + '! The title is: ' + title;
            post.Body = 'aefaef';
            // post.LinkUrl = url;
            insert post;
        }
        catch(Exception ex) {
            throw ex;
        }
    }
}
