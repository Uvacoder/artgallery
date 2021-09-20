import {writeImports} from "./writeImports";
import {writeExport} from "./writeExport";
import type {PathLike} from "fs";
import {existsSync, writeFileSync} from "fs";
import {join} from "path";
import {generatedFileName} from "./generatedFileName";
import {crawl} from "./crawl";
import {sortFileArraysNumerically} from "./sortFileArraysNumerically";


export function generateMediaFile(params: {
	generatedFilePath: PathLike;
	mediaPath: PathLike;
	acceptedFileExtensions: string[];
}){
	const {generatedFilePath, mediaPath, acceptedFileExtensions} = params;
	const tree = crawl({mediaPath});
	const generatedFileCompletePath = join(generatedFilePath.toString(), `${generatedFileName}.ts`);

	sortFileArraysNumerically({tree})

	if(existsSync(generatedFileCompletePath)){
		writeFileSync(generatedFileCompletePath, "");
	}

	writeImports({
		mediaPath, 
		generatedFilePath, 
		tree,
		acceptedFileExtensions
	});

	writeExport({
		tree, 
		generatedFilePath,
		acceptedFileExtensions
	});

};