import * as Yup from "yup";

const venueValidationSchema = Yup.object().shape({
    name: Yup.string()
        .min(2, "Too Short!")
        .max(35, "Too Long!")
        .required(),
    description: Yup.string()
        .min(2, "Too Short!")
        .max(7000, "Too Long!")
        .required(),
    url: Yup.string()
        .min(2, "Too Short!")
        .max(700, "Too Long!")
        .required(),
    locationId: Yup.number()
        .min(1, "Too Short!")
        .max(9999, "Invalid LocationId")
        .required()
});

export { venueValidationSchema };
