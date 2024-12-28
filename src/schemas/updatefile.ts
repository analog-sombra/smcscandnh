import {
  InferInput,
  minLength,
  minValue,
  number,
  object,
  string,
  pipe,
} from "valibot";

const UpdateFileSchema = object({
  applicant_name: pipe(string(), minLength(1, "Please enter applicant name.")),
  year: pipe(string(), minLength(1, "Please enter year.")),
  villageId: pipe(number(), minValue(1, "Select village.")),
  typeId: pipe(number(), minValue(1, "Select File Type.")),
});

type UpdateFileForm = InferInput<typeof UpdateFileSchema>;
export { UpdateFileSchema, type UpdateFileForm };
