import { memo, useState, useEffect, useMemo } from "react";
import { makeStyles } from "./theme";
import arrowSvg from "./assets/svg/next.svg";
import closeSvg from "./assets/svg/cancel.svg";
import { ReactSVG } from "react-svg";
import { useConstCallback } from "powerhooks/useConstCallback";
import { assert } from "tsafe/assert";

type LightBoxProps = {
    imageUrls: string[];
    openingImageIndex: number | undefined;
    closeLightBox: () => void;
};

const useStyles = makeStyles<{ isDisplayed: boolean }>()((...[, { isDisplayed }]) => ({
    "root": {
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "boxSizing": "border-box",
        "position": "fixed",
        "top": 0,
        "left": 0,
        "backgroundColor": "rgba(0,0,0, 0.8)",
        "width": "100vw",
        "height": "100vh",
        "padding": 40,
        "opacity": isDisplayed ? 1 : 0,
        "pointerEvents": isDisplayed ? undefined : "none",
    },
    "navButtons": {
        "minWidth": 30,
        "width": 50,
        "fill": "white",
    },

    "prevButton": {
        "transform": "rotate(180deg)",
        "marginRight": 50,
    },
    "nextButton": {
        "marginLeft": 50,
    },
    "closeButton": {
        "position": "absolute",
        "top": 30,
        "right": 30,
    },
    "imageWrapper": {
        "position": "absolute",
        "top": 0,
        "left": 0,
        "display": "grid",
        "width": "100%",
        "height": "100%",
        "boxSizing": "border-box",
        "gridTemplateRows": "100%",
        "gridTemplateColumns": "100%",
        "alignItems": "center",
        "justifyItems": "center",
        "zIndex": -1,
    },
    "image": {
        "gridRow": "1 / 2",
        "gridColumn": "1 / 2",
        "maxWidth": "75%",
        "maxHeight": "90%",
    },
}));

export const LightBox = memo((props: LightBoxProps) => {
    const { imageUrls, openingImageIndex, closeLightBox } = props;
    const { classes, cx } = useStyles({
        "isDisplayed": openingImageIndex !== undefined,
    });
    const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);

    const loadedImageIndexes = useMemo<number[]>(() => [], []);

    //console.log(loadedImageIndexes);

    useEffect(() => {
        if (openingImageIndex === undefined) {
            return;
        }

        if (!loadedImageIndexes.includes(openingImageIndex)) {
            loadedImageIndexes.push(openingImageIndex);
            loadedImageIndexes.sort((a, b) => a - b);
        }

        setCurrentIndex(loadedImageIndexes.find(index => index === openingImageIndex));
    }, [openingImageIndex]);

    const next = useConstCallback(() => {
        assert(currentIndex !== undefined);
        if (currentIndex === imageUrls.length - 1) {
            if (loadedImageIndexes[0] !== 0) {
                loadedImageIndexes.unshift(0);
            }
            setCurrentIndex(0);
            return;
        }

        if (!loadedImageIndexes.includes(currentIndex + 1)) {
            loadedImageIndexes.push(currentIndex + 1);
            loadedImageIndexes.sort((a, b) => a - b);
        }

        setCurrentIndex(currentIndex + 1);
    });

    const prev = useConstCallback(() => {
        assert(currentIndex !== undefined);
        if (currentIndex === 0) {
            if (loadedImageIndexes[loadedImageIndexes.length - 1] !== imageUrls.length - 1) {
                loadedImageIndexes.push(imageUrls.length - 1);
            }
            setCurrentIndex(imageUrls.length - 1);
            return;
        }

        if (!loadedImageIndexes.includes(currentIndex - 1)) {
            loadedImageIndexes.push(currentIndex - 1);
            loadedImageIndexes.sort((a, b) => a - b);
        }

        setCurrentIndex(currentIndex - 1);
    });

    return (
        <div className={classes.root}>
            <ReactSVG
                src={closeSvg}
                className={cx(classes.closeButton, classes.navButtons)}
                onClick={closeLightBox}
            />
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.prevButton)}
                onClick={prev}
            />
            <div className={classes.imageWrapper}>
                {loadedImageIndexes.map(imageIndex => (
                    <LightBoxImage
                        url={imageUrls[imageIndex]}
                        isVisible={imageIndex === currentIndex}
                        key={imageIndex}
                    />
                ))}
            </div>
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.nextButton)}
                onClick={next}
            />
        </div>
    );
});

const { LightBoxImage } = (() => {
    type LightBoxImageProps = {
        isVisible: boolean;
        url: string;
    };

    const useStyles = makeStyles<{ isVisible: boolean }>()((...[, { isVisible }]) => ({
        "root": {
            "opacity": isVisible ? 1 : 0,
            "gridRow": "1 / 2",
            "gridColumn": "1 / 2",
            "maxWidth": "75%",
            "maxHeight": "90%",
            "transition": "opacity 300ms",
        },
    }));

    const LightBoxImage = memo((props: LightBoxImageProps) => {
        const { url, isVisible } = props;

        const { classes } = useStyles({ isVisible });

        return <img src={url} alt="lightBoxImage" className={classes.root} />;
    });

    return { LightBoxImage };
})();
