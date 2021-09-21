import { memo, useState, useEffect } from "react";
import { makeStyles } from "./theme";
import arrowSvg from "./assets/svg/next.svg";
import closeSvg from "./assets/svg/cancel.svg";
import { useCallbackFactory } from "powerhooks/useCallbackFactory";
import { useConstCallback } from "powerhooks/useConstCallback";
import { ReactSVG } from "react-svg";

export type LightBoxProps = {
    className?: string;
    openingImageIndex?: number;
    imageUrls: string[];
    closeLightBox: () => void;
};

const animationDuration = 400;

const useStyles = makeStyles<{
    isActive: boolean;
}>()((...[, { isActive }]) => ({
    "root": {
        "position": "fixed",
        "width": "100%",
        "height": "100%",
        "top": 0,
        "left": 0,
        "backgroundColor": "rgba(0, 0, 0, 0.8)",
        "display": "flex",
        "justifyContent": "space-between",
        "alignItems": "center",
        "padding": 50,
        "boxSizing": "border-box",
        "transition": `opacity ${animationDuration}ms, transform ${animationDuration}ms`,
        "opacity": !isActive ? 0 : 1,
        "pointerEvents": !isActive ? "none" : undefined,
        "transform": !isActive ? "scale(0.5)" : "scale(1)",
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
    "image": {
        "minWidth": 200,
        "maxHeight": "90%",
    },
}));

export const LightBox = memo((props: LightBoxProps) => {
    const { imageUrls, className, openingImageIndex, closeLightBox } = props;
    const [currentIndex, setCurrentIndex] = useState<number | undefined>(undefined);

    const { classes, cx } = useStyles({
        "isActive": currentIndex !== undefined,
    });
    useEffect(() => {
        if (openingImageIndex === undefined) {
            return;
        }
        setCurrentIndex(openingImageIndex);
    }, [openingImageIndex]);

    const navigateImagesFactory = useCallbackFactory(async ([direction]: ["prev" | "next"]) => {
        if (openingImageIndex === undefined) {
            return;
        }

        const extremity = (() => {
            switch (direction) {
                case "prev":
                    return 0;
                case "next":
                    return imageUrls.length - 1;
            }
        })();

        const otherExtremity = (() => {
            switch (direction) {
                case "prev":
                    return imageUrls.length - 1;
                case "next":
                    return 0;
            }
        })();

        const nextIndex = (() => {
            switch (direction) {
                case "prev":
                    return -1;
                case "next":
                    return 1;
            }
        })();

        if ((currentIndex ?? openingImageIndex) === extremity) {
            setCurrentIndex(otherExtremity);
            return;
        }

        setCurrentIndex((currentIndex ?? openingImageIndex) + nextIndex);
    });

    const onClose = useConstCallback(async () => {
        setCurrentIndex(undefined);
        await new Promise<void>(resolve => setTimeout(resolve, animationDuration));
        closeLightBox();
    });

    return (
        <div className={cx(classes.root, className)}>
            <ReactSVG
                src={closeSvg}
                className={cx(classes.closeButton, classes.navButtons)}
                onClick={onClose}
            />
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.prevButton)}
                onClick={navigateImagesFactory("prev")}
            />
            <img
                className={classes.image}
                src={(() => {
                    if (openingImageIndex === undefined) {
                        return undefined;
                    }

                    return currentIndex === undefined
                        ? imageUrls[openingImageIndex]
                        : imageUrls[currentIndex];
                })()}
                alt="lightBox"
            />
            <ReactSVG
                src={arrowSvg}
                className={cx(classes.navButtons, classes.nextButton)}
                onClick={navigateImagesFactory("next")}
            />
        </div>
    );
});
