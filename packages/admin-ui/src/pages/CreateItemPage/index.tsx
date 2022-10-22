/** @jsxRuntime classic */
/** @jsx jsx */

import { Box, jsx } from '@keystone-ui/core';
import { LoadingDots } from '@keystone-ui/loading';
import { Button } from '@keystone-ui/button';
import { useRouter } from 'next/router';
import { ListMeta } from '@keystone-6/core/types';
import { useKeystone, useList } from '@keystone-6/core/admin-ui/context';
import { Fields } from '../../utils';
import { PageContainer } from '../../components/PageContainer';
import { GraphQLErrorNotice } from '../../components';
import { useCreateItem } from '../../utils/useCreateItem';
import { BaseToolbar, ColumnLayout, ItemPageHeader } from '../ItemPage/common';

function CreatePageForm(props: { list: ListMeta }) {
  const createItem = useCreateItem(props.list);
  const router = useRouter();
  return (
    <Box paddingTop="xlarge">
      {createItem.error && (
        <GraphQLErrorNotice
          networkError={createItem.error?.networkError}
          errors={createItem.error?.graphQLErrors}
        />
      )}

      <form
        onSubmit={async event => {
          event.preventDefault();
          const item = await createItem.create();
          if (item) {
            router.push(`/${props.list.path}/${item.id}`);
          }
        }}
      >
        <Fields {...createItem.props} />
        <BaseToolbar>
          <Button
            isLoading={createItem.state === 'loading'}
            type="submit"
            weight="bold"
            tone="active"
          >
            Create {props.list.singular}
          </Button>
        </BaseToolbar>
      </form>
    </Box>
  );
}

type CreateItemPageProps = { listKey: string };

export const getCreateItemPage = (props: CreateItemPageProps) => () =>
  <CreateItemPage {...props} />;

function CreateItemPage(props: CreateItemPageProps) {
  const list = useList(props.listKey);
  const { createViewFieldModes } = useKeystone();

  return (
    <PageContainer
      title={`Create ${list.singular}`}
      header={<ItemPageHeader list={list} label="Create" />}
    >
      <ColumnLayout>
        <Box>
          {createViewFieldModes.state === 'error' && (
            <GraphQLErrorNotice
              networkError={
                createViewFieldModes.error instanceof Error ? createViewFieldModes.error : undefined
              }
              errors={
                createViewFieldModes.error instanceof Error ? undefined : createViewFieldModes.error
              }
            />
          )}
          {createViewFieldModes.state === 'loading' && <LoadingDots label="Loading create form" />}
          <CreatePageForm list={list} />
        </Box>
      </ColumnLayout>
    </PageContainer>
  );
}