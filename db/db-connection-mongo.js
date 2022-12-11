const mongoose = require('mongoose');

const getConnection = async () => {
    try{
        const url = 'mongodb://Camilo_00:Saravs0603@ac-vea72if-shard-00-00.axs8qcp.mongodb.net:27017,ac-vea72if-shard-00-01.axs8qcp.mongodb.net:27017,ac-vea72if-shard-00-02.axs8qcp.mongodb.net:27017/inventarios-iud?ssl=true&replicaSet=atlas-11ms3v-shard-0&authSource=admin&retryWrites=true&w=majority';
        await mongoose.connect(url);
        console.log('conexion exitosa');

    }catch (error){
        console.log(error);
    }

}

module.exports = {
    getConnection,
}