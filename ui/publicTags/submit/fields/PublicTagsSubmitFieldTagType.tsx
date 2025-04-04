import { createListCollection } from '@chakra-ui/react';
import { capitalize } from 'es-toolkit';
import React from 'react';

import type { FormFields } from '../types';
import type { PublicTagType } from 'types/api/addressMetadata';

import type { SelectOption } from 'toolkit/chakra/select';
import FormFieldSelect from 'ui/shared/forms/fields/FormFieldSelect';

interface Props {
  index: number;
  tagTypes: Array<PublicTagType> | undefined;
}

const PublicTagsSubmitFieldTagType = ({ index, tagTypes }: Props) => {

  const getItemIcon = React.useCallback((type: PublicTagType) => {
    switch (type.type) {
      case 'name':
        return 'publictags_slim';
      case 'protocol':
      case 'generic':
        return <span>#</span>;
      default:
        return null;
    }
  }, []);

  const collection = React.useMemo(() => {
    const items = tagTypes?.map((type) => ({
      value: type.type,
      label: capitalize(type.type),
      icon: getItemIcon(type),
    })) ?? [];

    return createListCollection<SelectOption>({ items });
  }, [ tagTypes, getItemIcon ]);

  return (
    <FormFieldSelect<FormFields, `tags.${ number }.type`>
      name={ `tags.${ index }.type` }
      placeholder="Tag type"
      collection={ collection }
      required
    />
  );
};

export default React.memo(PublicTagsSubmitFieldTagType);
