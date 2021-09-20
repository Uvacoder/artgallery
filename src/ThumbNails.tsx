import {memo, useState, useMemo} from "react";
import {makeStyles} from "./theme";
import {ThumbNailImage} from "./ThumbNailImage";
import type {ImageProps} from "./ThumbNailImage";
import {LightBox} from "./LightBox";
import {useCallbackFactory} from "powerhooks";


export type ThumbNailProps = {
	images: Pick<ImageProps, "name" | "url">[];
	imageAverageHeight?: number;
};

const useStyles = makeStyles<{
	openingLightBoxImgIndex: number | undefined;
}>()(
	(...[, {openingLightBoxImgIndex}]) => ({
		"root": {
			"display": "flex",
			"width": "70%",
			"flexFlow": "row wrap",
			"boxSizing": "border-box"
		},
		"lightBox": {
			"transition": "opacity 400ms",
			"opacity": openingLightBoxImgIndex === undefined ? 0 : 1,
			"pointerEvents": openingLightBoxImgIndex === undefined ? "none" : undefined

		}
	})
);

export const ThumbNails = memo((props: ThumbNailProps) => {
	const { images, imageAverageHeight } = props;
	const [
		openingLightBoxImgIndex,
		setOpeningLightBoxImgIndex
	] = useState<number | undefined>(undefined);

	const { classes } = useStyles({ openingLightBoxImgIndex });
	const imageUrls = useMemo(()=>{
		return images.map(image => image.url)
	},[images]);

	const onClickFactory = useCallbackFactory((
		[index]: [number]
	) => {
		setOpeningLightBoxImgIndex(index)
	})



	return <div className={classes.root}>
		{
			images.map(
				({ name, url }, index) => <ThumbNailImage
					url={url}
					name={name}
					imageAverageHeight={imageAverageHeight}
					key={url}
					onClick={onClickFactory(index)}
				/>
			)
		}

		<LightBox
			imageUrls={imageUrls}
			className={classes.lightBox}
			openingImageIndex={openingLightBoxImgIndex}
		/>
	</div>

})

