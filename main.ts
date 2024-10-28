import { Plugin } from "obsidian";
import { Vault } from "index.js"

const template = ["---\n","aliases:\n","tags:\n","Class:\n","---"]



async function TemplateAdder(WorkingFile,mdfile){
	let modifiedFile = (template.join('')).concat('\n',WorkingFile)
    await app.vault.modify(mdfile,modifiedFile)
}

async function Adjuster(WorkingFile,FirstEdge,LastEdge,mdfile){
	let SLICED = WorkingFile.slice((FirstEdge+3),LastEdge) 
    //slicing the properties part

  	let n = SLICED.length
  	let doubledotINDEX = 0
  	let BeginningOfLine = 0
  	let array = []


  	while(true) {
    	doubledotINDEX = SLICED.lastIndexOf(":",n)
    	BeginningOfLine = SLICED.lastIndexOf("\n",doubledotINDEX) + 1
        array.unshift(SLICED.slice(BeginningOfLine,n))
        console.log(array)
        n = BeginningOfLine
        console.log(n)
        if ((n == 0) || (n == 1)) {break}
  	}	


    let finalarray = template

    for (let entryinarray of array){
    	if (entryinarray.startsWith('aliases:')){
              finalarray[1] = entryinarray
        }
        if (entryinarray.startsWith('tags:')){
              finalarray[2] = entryinarray
        }
        if (entryinarray.startsWith('Class:')){

          function createNewString(input) {
              // Start with the initial string
              let newString = 'Class:\n';

              // Use a regular expression to match all sections enclosed in double quotes
              const regex = /"([^"]*)"/g;
              let match;

              // Loop through all matches and append them to the new string
              while ((match = regex.exec(input)) !== null) {
                  // match[1] contains the content inside the double quotes, yep
                  newString += `  - "${match[1]}"\n`;
              }

              return newString;
          }

              finalarray[3] = createNewString(entryinarray)
        }
	}
    let FINAL = finalarray.join('')
    let modifiedFile = WorkingFile.replace(WorkingFile.slice(FirstEdge,LastEdge+3),FINAL)
    await app.vault.modify(mdfile,modifiedFile)
}

async function myFunction(mdfile){
    let WorkingFile = await app.vault.read(mdfile)
    let FirstEdge = WorkingFile.indexOf("---")
    let LastEdge = WorkingFile.indexOf("---",FirstEdge+1);
    // это нужно менять, эдиторы должны только возвращать изменненное но не менять самостоятельно?
  	if ((FirstEdge == -1) && (LastEdge == -1)){
  		TemplateAdder(WorkingFile,mdfile)        
  	} 
  	else if ((FirstEdge!= -1) && (LastEdge!= -1)){
  		Adjuster(WorkingFile,FirstEdge,LastEdge,mdfile)
	}
}


async function TempFunction(mdfile){

}

async function ObtainingFile(){

}


export default class ExamplePlugin extends Plugin {
async onload() {
	this.addRibbonIcon('dice', 'Reshape', async () => {
	    const files = await app.vault.getMarkdownFiles()
	    for (let mdfile of files){
	    	myFunction(mdfile)
	    }
    });
}

  
async onunload() {
    //console.log('unloading plugin')
  }

}









const fs = require('fs');
const path = require('path');

// Specify the directory containing the files
const directoryPath = './your_directory';

// Function to perform the text replacement in each file
function replaceTextInFiles(directory) {
  // Read all files in the directory
  fs.readdir(directory, (err, files) => {
    if (err) {
      console.error('Error reading directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(directory, file);

      // Read the file content
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          console.error(`Error reading file ${file}:`, err);
          return;
        }

        // Replace 'Class: "[[ExampleString]]"' with the new format
        const updatedData = data.replace(/Class: "(.*?)"/g, 'Class:\n  - "$1"');

        // Write the updated content back to the file
        fs.writeFile(filePath, updatedData, 'utf8', err => {
          if (err) {
            console.error(`Error writing to file ${file}:`, err);
          } else {
            console.log(`Updated file: ${file}`);
          }
        });
      });
    });
  });
}

// Run the replacement function
replaceTextInFiles(directoryPath);
