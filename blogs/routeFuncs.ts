const fs = require('fs');
const path = require('path');

interface path{
    name: string,
    childPaths: path[],
    childBlogs: string[],
};

export default function findAllBlogs(){
    let allBlogs: path;
    let path: string = "./blogs"

    
}