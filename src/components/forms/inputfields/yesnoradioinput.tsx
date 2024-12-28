import { Label } from "@/components/ui/label";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type YesNoRabioInputProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  required: boolean;
  valueOne?: String;
  valueTwo?: String;
  disable?: boolean;
};

export function YesNoRabioInput<T extends FieldValues>(
  props: YesNoRabioInputProps<T>
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // Get the error for this specific field
  const error = errors[props.name as keyof typeof errors];
  return (
    <Controller
      control={control}
      name={props.name}
      render={({ field }) => (
        <>
          <Label htmlFor={props.name} className="text-sm font-normal">
            {props.title}
            {props.required && <span className="text-rose-500">*</span>}
          </Label>
          <div className="flex sm:gap-4 mt-1 flex-col sm:flex-row ">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="yes"
                disabled={props.disable ?? false}
                checked={field.value === true}
                onChange={() => field.onChange(true)}
              />
              {props.valueOne ?? "Yes"}
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                value="no"
                disabled={props.disable ?? false}
                checked={field.value === false}
                onChange={() => field.onChange(false)}
              />
              {props.valueTwo ?? "No"}
            </label>
          </div>
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
