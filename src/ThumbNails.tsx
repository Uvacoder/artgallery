import { memo, useState } from "react";
import { makeStyles } from "./theme";
import { ThumbNailImage } from "./ThumbNailImage";
import type { ImageProps } from "./ThumbNailImage";
import { LightBox } from "./LightBox";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";

export type ThumbNailProps = {
    images: Pick<ImageProps, "name" | "url">[];
    imageAverageHeight?: number;
};

const useStyles = makeStyles()({
    "root": {
        "display": "flex",
        "flexFlow": "row wrap",
        "boxSizing": "border-box",
    },
});

export const ThumbNails = memo((props: ThumbNailProps) => {
    const { images, imageAverageHeight } = props;
    const [openingLightBoxImgIndex, setOpeningLightBoxImgIndex] = useState<number | undefined>(
        undefined,
    );

    const { classes } = useStyles();

    const onClickFactory = useCallbackFactory(([index]: [number]) => {
        setOpeningLightBoxImgIndex(index);
    });

    const closeLightBox = useConstCallback(() => {
        setOpeningLightBoxImgIndex(undefined);
    });

    return (
        <div className={classes.root}>
            {images.map(({ url, name }, index) => (
                <ThumbNailImage
                    url={url}
                    name={name}
                    imageAverageHeight={imageAverageHeight}
                    key={url}
                    onClick={onClickFactory(index)}
                />
            ))}

            <LightBox
                imageUrls={images.map(({ url }) => url)}
                openingImageIndex={openingLightBoxImgIndex}
                closeLightBox={closeLightBox}
            />
        </div>
    );
});
