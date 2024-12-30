//We imported the module here
const Product = require('../models/Products.js')



//We will do our testing here
const getAllProductsStatic =async (req,res) =>{
    //If we want our custom error handler to be called we just need to throw errors in any of the controllers
    // throw new Error('Testing levels')
    const products = await Product.find({
        //This checks for a pattern instead of going for the exact word
        // name:{$regex:search, $options:'i'}//The i simply means case insensitive
        price:{$gt:30}
    }).sort('price').select('name price').limit(10)
    res.status(200).json({msg:'Products Static Route',nbHits: products.length , products})
};




//We will set up the real functionality over here
const getAllProducts = async (req,res,next) =>{
    //We do this to control the kind of request a user can make with queries
    const {featured, company, name, sort, fields, numericFilters}= req.query;//Always destructure

    const queryObject ={};//We always have to set this as an empty object

    if(featured){//We used the ternary operator to convert the string into a boolean
        queryObject.featured=featured==='true' ? true : false;
        //if the featured value is =true return its boolean otherwise return false
    }
    if (company) {
        queryObject.company = company;
    }
    if(name){
        // queryObject.name=name;
        //We use any of the two codes below
        queryObject.name ={$regex:name, $options:'i'}//This is used to make the search case insensitive
        // queryObject.name=new RegExp(name,'i');//This is used to make the search case insensitive
    }
    if(numericFilters){
        console.log({numericFilters:numericFilters})
        //We have to map the operators  so that the use can make requests with them
        const  operatorMap  = {
            '<': '$lt',
            '>': '$gt',
            '=':  '$eq',
            '<=': '$lte',
            '>=': '$gte'
        }

        //All this part is used to replace the key on top with their corresponding values
        //Stack Overflow expression with flags
        const regEx = /\b(<|>|<=|>=|=)\b/g;
        let filters = numericFilters.replace(regEx,(match)=>`-${operatorMap[match]}-`)
        //The Code above converted the code above to what is understood by mongoose
        const options = ['price', 'ratings'];//We set the options so that the user can only compare these options
        filters=filters.split(',').forEach((item)=>{
            //We used Array destructuring here
            const [field,operator,value] = item.split('-');
            if (options.includes(field)){
                //We add the field to the the query Object
                //We are dynamically setting the value of the query object
                queryObject[field]={[operator]:Number(value)}
            }
            console.log(item);
        });
    }
    let result = Product.find(queryObject);
    if(sort){
        console.log({sort:sort});
        const sortList =sort.split(',').join(' ');//This is used to slit it into an array and join it together with spaces between them
        result = result.sort(sortList);
    }else {
        result=result.sort('createdAt')
    }
    if (fields) {
        console.log({fields: fields});
        const fieldList = fields.split(',').join(' ');
        result=result.select(fieldList);//This helps us to see only the values we selected
    }


    //Final touches for the api,default limit will be ten and skip will be 0
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;//Skip is used to skip all the first products and show the rest that were not included in the limit


    //This executes the final touches
    result = result.skip(skip).limit(limit);


    console.log(queryObject);
    const products = await  result;
    res.status(200).json({msg:'Products Route',nbHits: products.length , products: products})
};




module.exports = {
    getAllProducts,
    getAllProductsStatic,
};