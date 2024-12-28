import { Label } from "@/components/ui/label";
import { OptionValue } from "@/models/main";
import { capitalcase } from "@/utils/methods";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type RabioInputProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  required: boolean;
  options: OptionValue[];
  extratax?: JSX.Element;
  disable?: boolean;
};

export function RabioInput<T extends FieldValues>(props: RabioInputProps<T>) {
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
          <div className="w-full flex flex-wrap">
            <Label htmlFor={props.name} className="text-sm font-normal">
              {props.title}
              {props.required && <span className="text-rose-500">*</span>}
            </Label>
            {props.extratax && props.extratax}
          </div>
          <div className="flex gap-4">
            {props.options.map((val: OptionValue, index: number) => {
              return (
                <label className="flex items-center gap-2" key={index}>
                  <input
                    type="radio"
                    value={val.value}
                    checked={field.value === val.value}
                    onChange={() => field.onChange(val.value)}
                    disabled={props.disable ?? false}
                  />
                  <p className="text-sm">{capitalcase(val.label)}</p>
                </label>
              );
            })}
          </div>
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
