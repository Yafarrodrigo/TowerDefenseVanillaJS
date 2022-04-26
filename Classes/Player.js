export default class player{

    constructor(game){
        this.game = game
        this.lives = 10
        this.money = 100
    }

    checkIfMoney(buy, type){
        switch(type){
            case "normal":
                if(buy){
                    if(this.money >= 50){
                        return true
                    }
                    else return false
                }else{
                    if(this.money >= 25){
                        return true
                    }
                    else return false
                }
                
            
            case "slow":
                if(buy){
                    if(this.money >= 50){
                        return true
                    }
                    else return false
                }else{
                    if(this.money >= 75){
                        return true
                    }
                    else return false
                }
        }

        return false
    }
}