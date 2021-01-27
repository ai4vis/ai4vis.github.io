module.exports = {
    css: {
        loaderOptions:{
            less: {
                lessOptions: {
                    javascriptEnabled: true,
                }
            },
            scss: {
                
            }
        },
    },
    publicPath: 
        process.env.NODE_ENV === 'production' ? '/ai4vis.github.io': '/'
}