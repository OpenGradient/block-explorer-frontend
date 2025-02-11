import { createListCollection } from '@chakra-ui/react';
import React from 'react';

import hexToUtf8 from 'lib/hexToUtf8';
import { SelectItem, SelectContent, SelectValueText, SelectRoot, SelectControl } from 'toolkit/chakra/select';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

const OPTIONS = [
  { label: 'Hex', value: 'Hex' as const },
  { label: 'UTF-8', value: 'UTF-8' as const },
];

const collection = createListCollection({
  items: OPTIONS,
});

export type DataType = (typeof OPTIONS)[number]['value'];

interface Props {
  hex: string;
  rightSlot?: React.ReactNode;
  defaultDataType?: DataType;
  isLoading?: boolean;
  minHeight?: string;
}

const RawInputData = ({ hex, rightSlot: rightSlotProp, defaultDataType = 'Hex', isLoading, minHeight }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>(defaultDataType);

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setSelectedDataType(value[0] as DataType);
  }, []);

  const rightSlot = (
    <>
      <SelectRoot
        name="data-type"
        collection={ collection }
        variant="outline"
        defaultValue={ [ defaultDataType ] }
        onValueChange={ handleValueChange }
        w="100px"
        mr="auto"
      >
        <SelectControl loading={ isLoading }>
          <SelectValueText placeholder="Select framework"/>
        </SelectControl>
        <SelectContent>
          { collection.items.map((item) => (
            <SelectItem item={ item } key={ item.value }>
              { item.label }
            </SelectItem>
          )) }
        </SelectContent>
      </SelectRoot>
      { rightSlotProp }
    </>
  );

  return (
    <RawDataSnippet
      data={ selectedDataType === 'Hex' ? hex : hexToUtf8(hex) }
      rightSlot={ rightSlot }
      isLoading={ isLoading }
      textareaMaxHeight="220px"
      textareaMinHeight={ minHeight || '160px' }
      w="100%"
    />
  );
};

export default React.memo(RawInputData);
