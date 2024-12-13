import Queue from 'bull';

import { REDIS_HOST } from '../config/serverConfig.js';
import { REDIS_PORT } from '../config/serverConfig.js';


export default new Queue('mailQueue',{
    radis:{
        host:REDIS_HOST,
        port:REDIS_PORT
    }
})