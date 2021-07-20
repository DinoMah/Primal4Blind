const N = 1; 
const S = 2; 
const E = 4; 
const W = 8;
var DX = [];
DX[E] = 1;
DX[W] = -1;
DX[N] = 0;
DX[S] = 0;
var DY = [];
DY[E] = 0;
DY[W] = 0;
DY[N] = -1;
DY[S] = 1;
var OPPOSITE = [];
OPPOSITE[E] = W;
OPPOSITE[W] = E;
OPPOSITE[N] = S;
OPPOSITE[S] = N;

class Punto
{
    constructor(x, y)
    {
        this.x = x;
        this.y = y;
    }
}

function makeMaze(x, y) 
{
        var directions = [E, S, N, W];
        var points = [];
        var nx;
        var ny;
        var i;
        var j;
        points.push(new Punto(x, y));
        var heTerminado = false;
        for(i = 0; i < 800; i++)
        { //N = 1, S = 2, E = 4, W = 8
            if(heTerminado)
            {
                break;
            }
            directions = directions.sort( function() { return Math.random() - 0.5; } );
            for(j = 0; j < directions.length; j++)
            {
                nx = x + DX[directions[j]];
                ny = y + DY[directions[j]];
                if( nx == 18 && ny == 18)
                {
                    heTerminado = true;
                    break;
                }
                else if( (nx > 0 && nx < 18) && (ny > 0 && ny < 18) )
                {
                    points.push(new Punto(nx, ny));
                    x = nx;
                    y = ny;
                    break;
                }
            }
        }
        return points;
}

function findPoint(point, arrayOfPoints)
{
    for(var i = 0; i < arrayOfPoints.length; i++)
    {
        if( (point.x == arrayOfPoints[i].x) && (point.y == arrayOfPoints[i].y) )
        {    
            return true;
        }
    }
    return false;
}

function findPath(currentPosition, destination)
{
    
}

function findExit()
{
    pila = [];

}
function DFS(puntos, puntoInicial, meta) //Depth-First Search
{
    pila = [];
    hijos = []; //Pos 0 arriba, 1 abajo, 2 izq, 3 der.
    posiciones = [];
    pila.push(puntoInicial);
    console.log(meta);
    while(pila.length > 0)
    {
        hijos = [];
        posiciones = [];
        current = pila.pop();
        puntos[buscarPosPunto(puntos, current)].visited = true;
        hijos.push(new Punto(current.x, current.y - 1));
        hijos.push(new Punto(current.x, current.y + 1));
        hijos.push(new Punto(current.x - 1, current.y));
        hijos.push(new Punto(current.x + 1, current.y));
        for(var i  = 0; i < 4; i++)
        {
            posiciones.push(buscarPosPunto(puntos, hijos[i]));
            if(posiciones[i] == undefined || (puntos[posiciones[i]].visited == true))
                continue;
            puntos[posiciones[i]].visited = true;
            if(puntos[posiciones[i]].x == meta.x && puntos[posiciones[i]].y == meta.y)
            {
                pila.push(puntos[posiciones[i]]);
                return pila;
            }
            pila.push(puntos[posiciones[i]]);
        }
    }
    console.log("No encontré nada u_u'");
    return undefined;
}

function buscarPosPunto(puntos, puntoDeseado)
{
    for(var i = 0; i < puntos.length; i++)
    {
        if(puntos[i].x == puntoDeseado.x && puntos[i].y == puntoDeseado.y)
            return i;
    }
 
    return undefined;
}
/*function sortPoints(points)
{
    puntosX = [];
    puntosY = [];
    pointsAux = [];
    points.forEach(function(e)
    {
        puntosX.push(e.x);
    });
    points.forEach(function(e)
    {
        puntosY.push(e.y);
    });
    sortNumbers(puntosX);
    sortNumbers(puntosY);
    for(var i = 0; i < puntosX.length; i++)
        pointsAux.push(new Punto(puntosX[i], puntosY[i]));
}

function sortNumbers(numbers)
{
    var menor, aux;
    for(var i = 0; i < (numbers.length - 1); i++)
    {
        menor = i;
        for(var j = (i + 1); j < numbers.length; j++)
        {
            if(numbers[j] < numbers[menor])
            {
                menor = j;
            }
        }
        aux = numbers[i];
        numbers[i] = numbers[menor];
        numbers[menor] = aux; 
    }
}*/