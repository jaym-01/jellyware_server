const fs = require("fs");
const path = require("path");

// only directories have children
// only blog posts have actualPath
interface dirs {
  name: string;
  children?: dirs[];
  href?: string;
}

function matchString(str: string, regex: RegExp): boolean{
    const test = str.match(regex);
    return test != null && test[0] == str;
}

export default async function findAllBlogs(res) {
  let allDirs: dirs[] | undefined = findAllDirs("./blogs/blogs");
  res.json(allDirs);
}

function findAllDirs(startPath: string): dirs[] | undefined {
  var out: dirs[] = [];

  // find all file & folders in current path
  let contents = fs.readdirSync(startPath, { withFileTypes: true });

  let tmpChildren: dirs[] | undefined;
  let i: number;

  // check if it is a directory -> if it is it checks for sub directories
  // base case -> no more sub directories
  for (i = 0; i < contents.length; i++) {
    if (contents[i].isDirectory()) {
      tmpChildren = findAllDirs(startPath + "/" + contents[i].name);
      out.push({
        name: contents[i].name,
        children: tmpChildren,
        href:
          tmpChildren === undefined
            ? startPath.substring(7, startPath.length) + "/" + contents[i].name
            : undefined,
      });
    } else if (contents[i].name == "index.md") {
      return undefined;
    }
  }

  // returns list of directories and their children
  return out;
}

export async function getBlog(blogPath: string, res) {
  try {
    // validate url
    // first used regex - first char / -> each time -> it should only have 1 /
    // must only have aplha numeric chars
    // only other char is underscore
    // should not end in / -> if it does - remove it
    if(!matchString(blogPath, /(\/[A-Za-z_0-9]+)+\/?/g)) throw new Error("invalid path");
    
    
    if(blogPath[blogPath.length - 1] == '/') blogPath.substring(0, blogPath.length - 1);

    // check if path exists
    const filePath: string = "./blogs/blogs" + blogPath + "/index.md";
    if (fs.existsSync(filePath)) {
        res.sendFile(path.resolve(filePath));
    }
    else{
        throw new Error("Requested file does not exist")
    }
  } catch (e) {
    res.sendStatus(404);
  }
}
