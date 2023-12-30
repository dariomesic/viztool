module.exports={
    devServer: {
        proxy: 'http://167.172.100.26/'
    },
    //CURRENTLY SOLUTION FOR ERROR IN TABLE TO EXCEL
    configureWebpack: {
        module: {
            exprContextCritical: false
        }
    }
}