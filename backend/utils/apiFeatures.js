const { query } = require("express");

class APIFeatures {
    constructor(query, queryStr) {
        this.query = query;
        this.queryStr = queryStr;
    }

    search() {
        let keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,  //special word using for compare all wrods in collections
                $options: 'i'  // ignore case sensitive
            }
        } : {};
        this.query = this.query.find({ ...keyword })
        return this; // using for making chain function
    }

    filter() {
        const queryStrCopy = { ...this.queryStr };

        // Remove unwanted fields from the query
        const removeFields = ['keyword', 'limit', 'page'];
        removeFields.forEach(field => delete queryStrCopy[field]);
        
        let queryStr = JSON.stringify(queryStrCopy);        // Convert the query object to a string to replace operators
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`);   // Add the '$' prefix to MongoDB operators (gt(greater then), gte, lt, lte)  
        const parsedQuery = JSON.parse(queryStr);    // Convert the query string back into an object
        this.query.find(parsedQuery);     // Use the parsed query object for filtering     
        return this;
    }

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skips = (currentPage - 1) * resPerPage;
        this.query.limit(resPerPage).skip(skips);
        return this;
    }

}

module.exports = APIFeatures;