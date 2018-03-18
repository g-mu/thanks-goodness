import React, { Component } from 'react';
import {firebaseApp, meritData, profileData, categoryData} from '../api/firebase';

class StateManager {
    user = {
        merits: [],
        meritStats: {
            received: [],
            given: [],
        },
    };
    newaccountinfo = null;

    system = {
        merits: [],
        categories: [],
    };

    clearUserInfo = () => {
        this.user = {
            merits: [],
            meritStats: {
                received: [],
                given: [],
            },
        };
        this.newaccountinfo = null;
    }

    getSystemMerits = () => {
        return new Promise((resolve, reject)=>{
            //console.log('loading merits');
            if(this.system.merits.length > 0){
                resolve(this.system.merits);
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
                this.system.merits = vals;
                resolve(vals);
            }).catch((error) => {
                reject(error);
            });
        });
    };

    getSystemCategories = () => {
        return new Promise((resolve, reject)=>{
            //console.log('loading categories');
            if(this.system.categories.length > 0){
                resolve(this.system.categories);
            }
            categoryData.once('value').then((snapshot) => {
                let snap = snapshot.val();
                let vals = snap.sort();
                this.system.categories = vals;
                //console.log('categories',stateManager.system.categories);
                resolve(vals);
            }).catch((error) => {
                reject(error);
            });
        });
    };
}

let stateManager = new StateManager();
export default stateManager;




