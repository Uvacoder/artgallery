import {memo, useState} from "react";
import {makeStyles} from "./theme";
import {ReactComponent as ArrowSvg} from "./assets/svg/next.svg"
import {useCallbackFactory} from "powerhooks/useCallbackFactory";

export type LightBoxProps = {
	className?: string;
	openingImageIndex?: number;
	imageUrls: string[];
}

const useStyles = makeStyles()({
	"root": {
		"position": "fixed",
		"width": "100%",
		"height": "100%",
		"top": 0,
		"left": 0,
		"backgroundColor": "rgba(0, 0, 0, 0.8)",
		"display": "flex",
		"justifyContent": "center",
		"alignItems": "center",
		"padding": 50,
		"boxSizing": "border-box"
	},
	"navButtons": {
		"minWidth": 30,
		"width": 50,
		"fill": "white"

	},

	"prevButton": {
		"transform": "rotate(180deg)",
		"marginRight": 50
	},
	"nextButton": {
		"marginLeft": 50
	},
	"image": {
		"minWidth": 200,
		"maxHeight": "90%"
	}
})

export const LightBox = memo((props: LightBoxProps) => {

	const { imageUrls, className, openingImageIndex } = props;
	const { classes, cx } = useStyles();
	const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);

	const navigateImagesFactory = useCallbackFactory((
		[direction]: ["prev" | "next"]
	)=>{

		if(openingImageIndex === undefined){
			return;
		};

		const extremity = (()=>{
			switch(direction){
				case "prev": return 0;
				case "next": return imageUrls.length - 1
			}
		})();

		const otherExtremity = (()=>{
			switch(direction){
				case "prev": return imageUrls.length - 1;
				case "next": return 0;
			}
		})();

		const nextIndex = (()=>{
			switch(direction){
				case "prev": return -1;
				case "next": return 1;
			}
		})();

		if((currentIndex ?? openingImageIndex) === extremity){
			setCurrentIndex(otherExtremity);
			return;
		}

		setCurrentIndex(
			(currentIndex ?? openingImageIndex) + nextIndex
		);

	});



	return <div className={cx(classes.root, className)}>
		<ArrowSvg 
			className={cx(classes.navButtons, classes.prevButton)}
			onClick={navigateImagesFactory("prev")}
		/>
		<img 
			className={classes.image} 
			src={
				(()=>{
					if(openingImageIndex === undefined){
						return undefined;
					};

					return currentIndex === undefined ?
					imageUrls[openingImageIndex] :
					imageUrls[currentIndex]

				})()
			} 
			alt="lightBox"
		/>
		<ArrowSvg 
			className={cx(classes.navButtons, classes.nextButton)}
			onClick={navigateImagesFactory("next")}
		/>
	</div>
})