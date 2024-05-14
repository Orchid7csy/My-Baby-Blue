class Food{
    constructor(select){
        this.map=document.querySelector(select)
        this.food=document.createElement("div")
        this.food.className="food"
        //将食物放入地图
        this.map.appendChild(this.food)
        this.x=0
        this.y=0
        this.foodPos()
    }

    foodPos(){
        console.log(this.map.clientWidth)
        const w_num=this.map.clientWidth/62.5
        const h_num=this.map.clientHeight/62.5
    }
}