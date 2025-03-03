import React from 'react';

import { Field } from 'toolkit/chakra/field';
import { Input } from 'toolkit/chakra/input';

import { Section, Container, SectionHeader, SamplesStack, Sample, SectionSubHeader } from './parts';

const FieldShowcase = () => {
  return (
    <Container value="field">
      <Section>
        <SectionHeader>Size</SectionHeader>
        <SectionSubHeader>Default</SectionSubHeader>
        <SamplesStack>
          { ([ 'sm', 'md', 'lg' ] as const).map((size) => (
            <Sample label={ `size: ${ size }` } w="100%" key={ size } alignItems="flex-start">
              <Field label="Email" required size={ size } helperText="Helper text" maxWidth="200px">
                <Input size={ size }/>
              </Field>
              <Field label="Email (disabled)" required size={ size } maxWidth="200px">
                <Input size={ size } disabled value="me@example.com"/>
              </Field>
              <Field label="Email (readOnly)" required size={ size } maxWidth="200px">
                <Input size={ size } readOnly value="me@example.com"/>
              </Field>
              <Field label="Email (invalid)" required size={ size } errorText="Something went wrong" invalid maxWidth="200px">
                <Input size={ size } value="duck"/>
              </Field>
            </Sample>
          )) }

          <Sample label="size: xl" w="100%" alignItems="flex-start">
            <Field label="Email" required floating size="xl" helperText="Helper text" maxWidth="300px">
              <Input size="xl"/>
            </Field>
            <Field label="Email (disabled)" required floating disabled size="xl" maxWidth="300px">
              <Input size="xl" value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required floating readOnly size="xl" maxWidth="300px">
              <Input size="xl" value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required floating size="xl" errorText="Something went wrong" invalid maxWidth="300px">
              <Input size="xl" value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>

        <SectionSubHeader>On custom background</SectionSubHeader>
        <SamplesStack>
          <Sample label="no floating label" p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label="Email" required helperText="Helper text" maxWidth="200px">
              <Input/>
            </Field>
            <Field label="Email (disabled)" required disabled maxWidth="200px">
              <Input value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required readOnly maxWidth="200px">
              <Input value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required errorText="Something went wrong" invalid maxWidth="200px">
              <Input value="duck"/>
            </Field>
          </Sample>
          <Sample label="floating label" p={ 4 } bgColor={{ _light: 'blackAlpha.200', _dark: 'whiteAlpha.200' }} alignItems="flex-start">
            <Field label="Email" required floating size="xl" helperText="Helper text" maxWidth="300px">
              <Input size="xl"/>
            </Field>
            <Field label="Email (disabled)" required disabled floating size="xl" maxWidth="300px">
              <Input size="xl" value="me@example.com"/>
            </Field>
            <Field label="Email (readOnly)" required readOnly floating size="xl" maxWidth="300px">
              <Input size="xl" value="me@example.com"/>
            </Field>
            <Field label="Email (invalid)" required floating size="xl" errorText="Something went wrong" invalid maxWidth="300px">
              <Input size="xl" value="duck"/>
            </Field>
          </Sample>
        </SamplesStack>
      </Section>
    </Container>
  );
};

export default React.memo(FieldShowcase);
