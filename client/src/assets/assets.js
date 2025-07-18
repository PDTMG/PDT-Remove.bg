import logo from "./logo.jpg"
import videoBanner from "./videoBanner.mp4"
import people from "./people.png"
import peopleorg from "./people-org.jpg"
import credits from "./credit-card.png"
import cars from "./cars.jpg"
import carsOrg from "./cars-org.jpg"
import cat from "./cat.jpg"
import catOrg from "./cat-org.jpg"
import graphic from "./graphic.jpg"
import graphicOrg from "./graphic-org.jpg"
import product from "./product.jpg"
import productOrg from "./product-org.jpg"
import padutiOrg from "./paduti-org.jpg"
import paduti from "./paduti.png"


export const assets = {
    logo,
    videoBanner,
    people,
    peopleorg,
    credits,
    cars,
    carsOrg,
    cat,
    catOrg,
    graphic,
    graphicOrg,
    product,
    productOrg,
    paduti,
    padutiOrg,
}

export const steps = [
    {
        step: 1,
        title: "Select an image",
        description:
            "First, choose the image you want to remove background from by clicking on 'Start from a photo'.\n" +
            "Your image format can be PNG or JPG.\n" +
            "We support all image dimensions.",
    },
    {
        step: 2,
        title: "Let magic remove the background",
        description:
            "Our tool automatically removes the background from your image. Next, you can choose a background color.\n" +
            "Our most popular options are white and transparent backgrounds, but you can pick any color you like.",
    },
    {
        step: 3,
        title: "Download your image",
        description:
            "After selecting a new background color, download your photo and you're done!\n" +
            "You can also save your picture in the Photoroom App by creating an account.",
    },
]

export const categories = ["People", "Products", "Animals", "Cars", "Graphics"]

export const plans = [
    {
        id: "Basic",
        name: "Basic Package",
        price: 260000,
        credits: "100 credits",
        description: "Best for personal use",
        popular: false,
    },
    {
        id: "Premium",
        name: "Premium Package",
        price: 500000,
        credits: "500 credits",
        description: "Best for small businesses",
        popular: true,
    },
    {
        id: "Ultimate",
        name: "Ultimate Package",
        price: 1000000,
        credits: "1000 credits",
        description: "Best for large businesses",
        popular: false,
    },
]

export const testimonials = [
    {
        id: 1,
        quote: "I've been using Photoroom for a few months now and it's been a game-changer for my business.",
        author: "Duc Thinh",
        handle: "@DucThinh",
    },
    {
        id: 2,
        quote: "I've been using Photoroom for a few months now and it's been a game-changer for my business. ",
        author: "John Doe",
        handle: "@johndoe",
    },
    {
        id: 3,
        quote: "I've been using Photoroom for a few months now and it's been a game-changer for my business.",
        author: "Ngoc Tho",
        handle: "@NgocTho",
    },
]

export const FOOTER_CONSTANTS = [
    {
        url: "https://www.facebook.com",
        logo: "https://www.facebook.com/favicon.ico",
    },
    {
        url: "https://www.twitter.com",
        logo: "https://www.twitter.com/favicon.ico",
    },
    {
        url: "https://www.linkedin.com",
        logo: "https://www.linkedin.com/favicon.ico",
    },
]

export const categoryImages = {
    People: {
        original: padutiOrg,
        removed: paduti,
    },
    Products: {
        original: productOrg,
        removed: product,
    },
    Animals: {
        original: catOrg,
        removed: cat,
    },
    Cars: {
        original: carsOrg,
        removed: cars,
    },
    Graphics: {
        original: graphicOrg,
        removed: graphic,
    },
}
