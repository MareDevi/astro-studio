import type React from 'react';
import {
  formatIsoDate,
  formatIsoDateTime,
  parseIsoDate,
} from '../../../lib/dates';
import { getNestedValue } from '../../../lib/object-utils';
import type { SchemaField } from '../../../lib/schema';
import { useEditorStore } from '../../../store/editorStore';
import type { FieldProps } from '../../../types/common';
import { DatePicker } from '../../ui/date-picker';
import { FieldWrapper } from './FieldWrapper';

interface DateFieldProps extends FieldProps {
  field?: SchemaField;
}

export const DateField: React.FC<DateFieldProps> = ({
  name,
  label,
  required,
  field,
}) => {
  const value = useEditorStore((state) =>
    getNestedValue(state.frontmatter, name),
  );
  const updateFrontmatterField = useEditorStore(
    (state) => state.updateFrontmatterField,
  );

  return (
    <FieldWrapper
      label={label}
      required={required}
      description={
        field && 'description' in field ? field.description : undefined
      }
      defaultValue={field?.default}
      constraints={field?.constraints}
      currentValue={value}
    >
      <DatePicker
        value={
          value && typeof value === 'string' ? parseIsoDate(value) : undefined
        }
        onChange={(date: Date | undefined) => {
          if (!date || Number.isNaN(date.getTime())) {
            updateFrontmatterField(name, undefined);
            return;
          }

          let dateValue: string;

          // If the field name is 'timestamp' or similar, OR if the current value
          // already contains a full ISO timestamp (with 'T' and time), preserve the format.
          const isTimestampField =
            name.toLowerCase() === 'timestamp' ||
            name.toLowerCase() === 'pubdate' ||
            name.toLowerCase() === 'publisheddate' ||
            name.toLowerCase() === 'updateddate' ||
            name.toLowerCase() === 'modifieddate';

          const alreadyHasTime =
            typeof value === 'string' &&
            value.includes('T') &&
            (value.endsWith('Z') || value.includes('+'));

          if (isTimestampField || alreadyHasTime) {
            // If we have an existing value with time, try to preserve the time portion
            // when just changing the date.
            if (alreadyHasTime) {
              // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
              const originalDate = new Date(value as string);
              if (!Number.isNaN(originalDate.getTime())) {
                // Update date but keep time
                date.setHours(
                  originalDate.getHours(),
                  originalDate.getMinutes(),
                  originalDate.getSeconds(),
                  originalDate.getMilliseconds(),
                );
                dateValue = formatIsoDateTime(date);
              } else {
                dateValue = formatIsoDateTime(date);
              }
            } else {
              // Default to current time for timestamp fields if no time exists yet
              const now = new Date();
              date.setHours(
                now.getHours(),
                now.getMinutes(),
                now.getSeconds(),
                now.getMilliseconds(),
              );
              dateValue = formatIsoDateTime(date);
            }
          } else {
            // Default to date-only for standard date fields
            dateValue = formatIsoDate(date);
          }

          updateFrontmatterField(name, dateValue);
        }}
        placeholder="Select date..."
      />
    </FieldWrapper>
  );
};
