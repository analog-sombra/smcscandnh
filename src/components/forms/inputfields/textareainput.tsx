import { Label } from "@/components/ui/label";
import { Input } from "antd";
import { Controller, FieldValues, Path, useFormContext } from "react-hook-form";

type TaxtAreaInputProps<T extends FieldValues> = {
  name: Path<T>;
  title: string;
  placeholder: string;
  required: boolean;
  onlynumber?: boolean;
  disable?: boolean;
  maxlength?: number;
};

export function TaxtAreaInput<T extends FieldValues>(
  props: TaxtAreaInputProps<T>
) {
  const {
    control,
    formState: { errors },
  } = useFormContext();

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
          <Input.TextArea
            showCount={props.maxlength ? true : undefined}
            maxLength={props.maxlength ?? undefined}
            status={error ? "error" : undefined}
            className="w-full h-20 resize-none"
            value={field.value}
            disabled={props.disable ?? false}
            onChange={(e) => {
              if (!e) return;
              let { value } = e.target;
              if (props.onlynumber) {
                value = value.replace(/[^0-9]/g, ""); // Filter out non-numeric characters
              }
              field.onChange(value);
            }}
            placeholder={props.placeholder}
            rows={4}
            style={{ resize: "none" }}
            allowClear
          />
          {error && (
            <p className="text-xs text-red-500">{error.message?.toString()}</p>
          )}
        </>
      )}
    />
  );
}
