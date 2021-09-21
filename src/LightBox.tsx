import { memo } from "react";
import { makeStyles } from "./theme";
import arrowSvg from "./assets/svg/next.svg";
import closeSvg from "./assets/svg/cancel.svg";
import { ReactSVG } from "react-svg";

type LightBoxProps = {
    imageUrls: string[];
};

const useStyles = makeStyles()({
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
        "border": "solid red 2px",
        "width": "100%",
        "height": "100%",
        "boxSizing": "border-box",
        "gridTemplateRows": "100%",
        "gridTemplateColumns": "100%",
        "alignItems": "center",
        "justifyItems": "center",
    },
    "image": {
        "gridRow": "1 / 2",
        "gridColumn": "1 / 2",
        "maxWidth": "75%",
        "maxHeight": "90%",
    },
});

export const LightBox = memo((props: LightBoxProps) => {
    const { imageUrls } = props;
    const { classes, cx } = useStyles();
    return (
        <div className={classes.root}>
            <ReactSVG src={closeSvg} className={cx(classes.closeButton, classes.navButtons)} />
            <ReactSVG src={arrowSvg} className={cx(classes.navButtons, classes.prevButton)} />
            <div className={classes.imageWrapper}>
                {imageUrls.map(url => (
                    <img className={classes.image} src={url} alt="lightBox"></img>
                ))}
            </div>
            <ReactSVG src={arrowSvg} className={cx(classes.navButtons, classes.nextButton)} />
        </div>
    );
});
