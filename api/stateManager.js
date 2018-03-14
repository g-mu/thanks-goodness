import React, { Component } from 'react';
import {firebaseApp, meritData, profileData, categoryData} from '../api/firebase';

export default stateManager = {
    user: {
        merits: [],
        meritStats: {
            received: [],
            given: [],
        },
    },
    newaccountinfo: null,

    system: {
        merits: [],
        categories: [],
    },

    getSystemMerits: () => {
        return new Promise((resolve, reject)=>{
            //console.log('loading merits');
            if(stateManager.system.merits.length > 0){
                resolve(stateManager.system.merits);
            }
            meritData.once('value').then((snapshot) => {
                let snap = snapshot.val();
                let keys = Object.keys(snap);
                //console.log(keys);
                let vals = [];
                for (var i = 0; i < keys.length; i++) {
                    let m = snap[keys[i]];
                    m.key = keys[i];
                    vals.push(m);
                }
                //console.log('merits',vals);
                stateManager.system.merits = vals;
                resolve(vals);
            }).catch((error) => {
                reject(error);
            });
        });
    },
    getSystemCategories: () => {
        return new Promise((resolve, reject)=>{
            console.log('loading categories');
            if(stateManager.system.categories.length > 0){
                resolve(stateManager.system.categories);
            }
            categoryData.once('value').then((snapshot) => {
                let snap = snapshot.val();
                let vals = snap.sort();
                stateManager.system.categories = vals;
                //console.log('categories',stateManager.system.categories);
                resolve(vals);
            }).catch((error) => {
                reject(error);
            });
        });
    },
}






