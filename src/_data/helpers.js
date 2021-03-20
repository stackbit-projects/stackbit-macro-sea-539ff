const slugify = require('slugify');

module.exports = {
    currentYear() {
        const today = new Date();
        return today.getFullYear();
    },
    collectionTags(col,collections){
        col = typeof col == "string" ? collections[col] : col;
        return [...new Set(col.map(item=>item.data.tags||[]).flat().filter(item=>col!=collections[item]) )]        
    },
    slug(str){ return slugify(str,{strict:true})}
};
