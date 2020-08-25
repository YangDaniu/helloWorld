function createArray(n){
    const rt = []
    for(let i = 0; i < n; i ++){
        rt[i] = []
        for(let j = 0; j < n; j++){
            rt[i].push( (i*n) +j)
        }
    }
    return rt
}

function getTime(n){
    if(n >= 3){
        if(n % 2){
            return getTime(n - 1) + 1
        }else{
            return getTime(n - 1) + 3
        }
    }else if(n === 0 ){
        return 0
    }else if(n === 1 ){
        return 1
    }else if(n === 2 ){
        return 4
    }
}

function rotateArray(arr, n){
    let rt = []
    let counter = 1
    let quanshu = 0
    let isRow = true
    let direction = 1
    let row = 0
    let col = 0
    for(let i = 0; i < getTime(n); i ++){
        switch( counter % 4){
            case 1:{
                row = quanshu
                col = quanshu
                direction = 1
                break
            }
            case 2:{
                row = quanshu
                col = n-1 - quanshu
                direction = 1
                break
            }
            case 3:{
                row = n-1 - quanshu
                col = n-1 - quanshu
                direction = 0
                break
            }
            case 0:{
                row = n-1 - quanshu
                col = quanshu
                direction = 0
                break
            }
        }
        //console.log(`counter:`, counter)
        //console.log(row, col, n - quanshu * 2, isRow, direction)
        rt.push( transArray(arr, row, col, n - quanshu * 2, isRow, direction))

        

        if(counter === 4){
            quanshu += 1
            counter = 0
        }

        counter += 1
        
        isRow = !isRow
        
    }
    return rt
}

function transArray(arr, i, j, n,isRow, direction){
    if(n === 1){
        return [ arr[i][j] ]
    }else{
        let rt = []
    if(isRow){
        for(let k = 0; k < n - 1; k ++){
            if(direction){
               rt.push(arr[i][j + k]) 
            }else{
               rt.push(arr[i][j - k]) 
            }
            
        }
    }else{
        for(let k = 0; k < n - 1; k ++){
            if(direction){
               rt.push(arr[i + k][j]) 
            }else{
               rt.push(arr[i - k][j]) 
            }
        }
    }
    return rt
    }
    
}
var num = 6
var a = createArray(num)
var b = rotateArray(a, num)

console.log(a, b)

console.log(getTime(num -1))
