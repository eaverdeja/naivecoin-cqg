import * as peer from './peer';
import * as block from './block';
import * as transaction from './transaction';

export const mutations = { ...peer, ...block, ...transaction };
