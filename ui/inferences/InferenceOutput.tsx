import React from 'react';

import type { DecodedInputParams } from 'types/api/decodedInput';

import { convertArrayToLLMChatResponse } from 'lib/inferences/llmChat/response';
import { convertArrayToLLMCompletionResponse } from 'lib/inferences/llmCompletion/convert';
import { convertArrayToModelOutput } from 'lib/inferences/traditional/convert';

import ChatMessage from './ChatMessage';
import Item from './layout/Item';
import VStackContainer from './layout/VStackContainer';

interface InferenceOutputProps {
  value: DecodedInputParams['value'];
  isLoading?: boolean;
}

// Helper function to format arrays without quotes around string values
const formatArray = (arr: Array<string | number>): string => {
  if (arr.length === 0) return '[]';
  return `[${ arr.map(v => typeof v === 'string' ? v : String(v)).join(', ') }]`;
};

// Helper function to format values without unnecessary quotes
const formatValue = (val: unknown): string => {
  if (val === null || val === undefined) return 'None';
  if (typeof val === 'string') return val;
  if (typeof val === 'number' || typeof val === 'bigint') return String(val);
  if (typeof val === 'boolean') return val ? 'true' : 'false';
  if (Array.isArray(val)) {
    // For arrays of primitives, format without quotes
    if (val.every(item => typeof item === 'string' || typeof item === 'number')) {
      return formatArray(val as Array<string | number>);
    }
    return JSON.stringify(val, null, 2);
  }
  if (typeof val === 'object') {
    return JSON.stringify(val, null, 2);
  }
  return String(val);
};

const InferenceOutput = ({ value, isLoading }: InferenceOutputProps) => {
  try {
    const modelOutput = convertArrayToModelOutput(value);
    if (modelOutput) {
      const { numbers, strings, jsons } = modelOutput;
      const elements: Array<React.ReactNode> = [];
      if (numbers.length > 0) {
        elements.push(...numbers.map(({ name, values }) => {
          const decimalValues = values.map((v) => (Number(v.value) / (10 ** Number(v.decimals))));
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { JSON.stringify(decimalValues) }
            </Item>
          );
        }));
      }
      if (strings.length > 0) {
        elements.push(...strings.map(({ name, values }) => {
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { formatArray(values) }
            </Item>
          );
        }));
      }
      if (jsons.length > 0) {
        elements.push(...jsons.map(({ name, value }) => {
          return (
            <Item key={ name } label={ name } isLoading={ isLoading } isCode>
              { JSON.stringify(JSON.parse(value), null, 2) }
            </Item>
          );
        }));
      }

      if (elements.length > 0) {
        return <VStackContainer>{ elements }</VStackContainer>;
      }
    }

    const llmChatResponse = convertArrayToLLMChatResponse(value);
    if (llmChatResponse) {
      const { finishReason, message } = llmChatResponse;
      return (
        <VStackContainer>
          <Item label="Finish Reason" isLoading={ isLoading }>
            { finishReason }
          </Item>
          <Item isLoading={ isLoading }>
            <ChatMessage message={ message }/>
          </Item>
        </VStackContainer>
      );
    }

    const llmCompletionResponse = convertArrayToLLMCompletionResponse(value);
    if (llmCompletionResponse) {
      const { answer } = llmCompletionResponse;
      return answer.length > 0 ? (
        <Item isCode whiteSpace="pre-wrap">
          { llmCompletionResponse.answer }
        </Item>
      ) : 'None';
    }
  } catch {}

  if (!value) return null;

  const formattedValue = formatValue(value);
  const isComplexValue = typeof value === 'object' && value !== null;

  return (
    <Item isLoading={ isLoading } isCode={ isComplexValue } whiteSpace={ isComplexValue ? 'pre-wrap' : undefined }>
      { formattedValue }
    </Item>
  );
};

export default InferenceOutput;
