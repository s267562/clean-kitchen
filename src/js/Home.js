//home
import { Component } from 'react';
import { makeStyles, ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper'
import { Box } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import "typeface-overpass";
import "typeface-ubuntu";

//dialog
import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import MuiDialogTitle from '@material-ui/core/DialogTitle';
import MuiDialogContent from '@material-ui/core/DialogContent';
import MuiDialogActions from '@material-ui/core/DialogActions';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

//stepper
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';

const useStyles2 = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
}));

const styles = (theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: 'absolute',
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const DialogTitle = withStyles(styles)((props) => {
  const { children, classes, onClose, ...other } = props;
  return (
    <MuiDialogTitle disableTypography className={classes.root} {...other}>
      <Typography variant="h6">{children}</Typography>
      {onClose ? (
        <IconButton aria-label="close" className={classes.closeButton} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      ) : null}
    </MuiDialogTitle>
  );
});

const DialogContent = withStyles((theme) => ({
  root: {
    padding: theme.spacing(2),
  },
}))(MuiDialogContent);

const DialogActions = withStyles((theme) => ({
  root: {
    margin: 0,
    padding: theme.spacing(1),
  },
}))(MuiDialogActions);


const customFont = createMuiTheme({
    typography: {
        h6: {
            fontFamily: [
                'Overpass',
                'sans-serif',
            ].join(','),
        },
        h5: {
            fontFamily: [
                'Ubuntu',
                'sans-serif',
            ].join(','),
        },
    },
});

function newGradient(name) {

    var backgroundGradient = null;

    switch (name) {
        case "breakfast":
            backgroundGradient = 'radial-gradient(at top left, rgb(255, 222, 97), rgb(219, 153, 5))'
            break;
        case "fish":
            backgroundGradient = 'radial-gradient(at top left, rgb(15, 187, 194), rgb(58, 82, 194))'
            break;
        case "meat":
            backgroundGradient = 'radial-gradient(at top left, rgb(247, 147, 42), rgb(221, 31, 31))'
            break;
        case "vegan":
            backgroundGradient = 'radial-gradient(at top left, rgb(56, 230, 118), rgb(49, 139, 143))'
            break;
        case "dessert":
            backgroundGradient = 'radial-gradient(at top left, rgb(13, 245, 169), rgb(160, 143, 247))'
            break;
    
        default:
            break;
    }

    return backgroundGradient;
  }
  

const useStyles = makeStyles({
    rootGridScrollView: {
        overflowY: "hidden",
        overflowX: "hidden",
        alignItems: "safe center",
    },
    scrollViewCategory: {
        justifyContent: "space-between",
        flexFlow: "row",
        overflowX: "scroll",
        scrollbarWidth: "none",
        paddingTop: 8,
        paddingBottom: 8,
    },
    cardCategory: {
        width: 65,
        height: 65,
        margin: 8,
        padding: 8,
        borderRadius: 18,
        minWidth: 48,
        //background: newGradient,
        /*background: `radial-gradient(circle, rgba(251,179,63,0.9415967070421919) 0%, rgba(252,70,107,1) 100%)`,*/
        /*backgroundColor: "rgb(63,94,251)", /*this your primary color*/
    },
    mediaCategory: {
        height: 44,
        padding: 4,
    },
    contentCategory: {
       padding: 0,
       textAlign: "center",
    },
    textCategory: {
        color: "#FFFFFF",
        margin: 0,
        fontSize: "0.7rem", 
        marginBottom: "0.35em", 
    },
    scrollViewSuggestion: {
        flexFlow: "row",
        overflowX: "scroll",
        scrollbarWidth: "none",
        padding: 8,
    },
    cardSuggestion: {
        minWidth: 300,
        height: 185,
        position: 'relative',
        margin: 8,
        borderRadius: 12,
        '&:after': {
            content: '""',
            display: 'block',
            position: 'absolute',
            width: '100%',
            height: '70%',
            bottom: 0,
            zIndex: 1,
            background: 'linear-gradient(to top, #000, rgba(0,0,0,0))',
        },
    },
    mediaSuggestion: {
        height: "100%",
    },
    contentSuggestion: {
        position: 'absolute',
        zIndex: 2,
        bottom: 0,
        width: '100%',
    },
    textSuggestion: {
        color: "#FFFFFF",
        margin: 0, 
        flexWrap: 1,
    },
    headerSuggestion: {
        display: "flex",
        alignItems: "center",
        flexGrow: 0,
        paddingLeft: 8,
        flexFlow: "row",
    },
});
class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    componentWillUnmount() {
    }

    render() {

        return <>
            <CustomizedDialogs />
            <GridCategory />
            <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px"}}>
            <HeaderSuggestion title="Popular" icon="fire.png" />
            <GridSuggestion recipe="Pasta alla Carbonara" img="carbonara.jpg" />
            </Paper>
            <Paper elevation={0} square style={{ marginTop: "8px", marginBottom: "8px", padding: "8px"}}>
            <HeaderSuggestion title="Editor's Choice" icon="choice.png" />
            <GridSuggestion recipe="Cheesecake" img="cheesecake.jpg" />
            </Paper>
        </>
    }
}

function CardCategory(props) {
    const classes = useStyles();
    const bgColor = newGradient(props.name)

    return (
        <Card elevation={8} className={classes.cardCategory} style={{background: bgColor}}>
                <CardMedia
                    className={classes.mediaCategory}
                image={`/res/images/${props.name}.png`}
                title={props.name}
                />
            <CardContent className={classes.contentCategory}>
                <Typography variant="button" component="h1" className={classes.textCategory}>
                {props.name}
            </Typography>
            </CardContent>
        </Card>
    );
}

function GridCategory() {
    const classes = useStyles();

    return (
        <Grid container className={classes.rootGridScrollView}>
            <Grid item xs>
                <Grid container className={classes.scrollViewCategory
        }>
                    {["breakfast", "fish", "meat", "vegan", "dessert"].map((value) => (
                        <Grid key={value} item>
                            <CardCategory name={value} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

function CardSuggestion(props) {
    const classes = useStyles();

    return (
        <Card elevation={8} className={classes.cardSuggestion}>
            <CardMedia
                className={classes.mediaSuggestion}
                image={`/res/images/${props.img}`}
                title={props.recipe}
            />
            <CardContent className={classes.contentSuggestion}>
                <ThemeProvider theme={customFont}>
                    <Typography gutterBottom variant="h6" component="h1" className={classes.textSuggestion}>
                        {props.recipe}
            </Typography>
                </ThemeProvider>
            </CardContent>
        </Card>
    );
}

function GridSuggestion(props) {
    const classes = useStyles();

    return (
        <Grid container className={classes.rootGridScrollView}>
            <Grid item xs>
                <Grid container className={classes.scrollViewSuggestion}>
                    {[0, 1, 2].map((value) => (
                        <Grid key={value} item>
                            <CardSuggestion recipe={props.recipe} img={props.img} />
                        </Grid>
                    ))}
                </Grid>
            </Grid>
        </Grid>
    );
}

function HeaderSuggestion(props) {
    const classes = useStyles();

    return (
        <div className={classes.headerSuggestion}>
            <img src={`res/images/${props.icon}`} width='26' height='26' alt="fire" />
            <ThemeProvider theme={customFont}>
                <Typography variant ="h5">
                    <Box fontWeight="400"  paddingLeft="8px">
                        {props.title}</Box>
                </Typography>
            </ThemeProvider>
        </div>
    );
}

//dialog function
function CustomizedDialogs() {
    const [open, setOpen] = React.useState(true);
  
    const handleClickOpen = () => {
      setOpen(true);
    };
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <div>
        <Dialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
          <DialogTitle id="customized-dialog-title" onClose={handleClose}>
            Modal title
          </DialogTitle>
          <DialogContent dividers>
            <VerticalLinearStepper /> {/* inserimento stepper nel dialogo*/}
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={handleClose} color="primary" variant="contained">
              START
             </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
  

//stepper function
function getSteps() {
    return ['Welcome in Clean Kitchen!', 'Select what you want to cook', 'Browse pages', 'Set a timer'];
  }
  
  function getStepContent(step) {
    switch (step) {
        case 0:
            return `You wouldn't prefer to touch your screen while cooking, do you?
            Let's see how it works`;
          case 1:
            return 'image';
          case 2:
            return `Bring your hand closer to the screen when you want to change page.`;
          case 3:
            return `If you would like to set a timer, just hold on the sensor for 3 seconds.`;
          default:
            return 'Unknown step';
    }
  }
  
  function VerticalLinearStepper() {
    const classes = useStyles2();
    const [activeStep, setActiveStep] = React.useState(0);
    const steps = getSteps();
  
    const handleNext = () => {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };
  
    const handleBack = () => {
      setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };
  
    const handleReset = () => {
      setActiveStep(0);
    };
  
    return (
      <div className={classes.root}>
        <Stepper activeStep={activeStep} orientation="vertical">
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
              <StepContent>
                <Typography>{getStepContent(index)}</Typography>
                <div className={classes.actionsContainer}>
                  <div>
                    <Button
                      disabled={activeStep === 0}
                      onClick={handleBack}
                      className={classes.button}
                    >
                      Back
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleNext}
                      className={classes.button}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </StepContent>
            </Step>
          ))}
        </Stepper>
        {activeStep === steps.length && (
        <Paper square elevation={0} className={classes.resetContainer}>
          <Typography>You're ready to start!</Typography>
        </Paper>
      )}
      </div>
    );
  }

export default Home;