import { memo, useState, useMemo } from "react";
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
    const imageUrls = useMemo(() => {
        return images.map(image => image.url);
    }, [images]);

    const onClickFactory = useCallbackFactory(([index]: [number]) => {
        setOpeningLightBoxImgIndex(index);
    });

    const closeLightBox = useConstCallback(() => {
        setOpeningLightBoxImgIndex(undefined);
    });

    return (
        <div className={classes.root}>
            {images.map(({ name, url }, index) => (
                <ThumbNailImage
                    url={url}
                    name={name}
                    imageAverageHeight={imageAverageHeight}
                    key={url}
                    onClick={onClickFactory(index)}
                />
            ))}

            <LightBox imageUrls={images./*slice(0, 3).*/ map(({ url }) => url)} />
        </div>
    );
});
