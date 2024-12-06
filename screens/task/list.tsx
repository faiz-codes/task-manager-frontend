import { Box } from "@/components/ui/box";
import { HStack } from "@/components/ui/hstack";
import { isWeb } from "@gluestack-ui/nativewind-utils/IsWeb";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { Button, ButtonText } from "@/components/ui/button";
import { ScrollView } from "@/components/ui/scroll-view";
import { GridItem } from "@/components/ui/grid";

import { SafeAreaView } from "@/components/ui/safe-area-view";
import { useMutation, useQuery } from "@apollo/client";
import { Spinner } from "@/components/ui/spinner";
import { GET_MYTASKS } from "@/graphql/queries";
import { Task } from "@/interface/task";
import { Heading } from "@/components/ui/heading";
import React, { useState } from "react";
import { Input, InputField } from "@/components/ui/input";
import { ADD_TASK, COMPLETE_TASK } from "@/graphql/mutations";
import { Textarea, TextareaInput } from "@/components/ui/textarea";
import { formatDate } from "@/util";
import DateTimePicker from "@react-native-community/datetimepicker";
import Toast from "react-native-root-toast";

const MainContent = () => {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [duedate, setDuedate] = useState(new Date());

  const { loading, data, refetch } = useQuery(GET_MYTASKS, {
    variables: {
      open: true,
    },
    onError(error) {
      console.log("[GraphQL Error] " + error);
    },
  });

  const [addTask] = useMutation(ADD_TASK);
  const [completeTask] = useMutation(COMPLETE_TASK);

  const handleAddTask = () => {
    addTask({
      variables: {
        title,
        notes,
        duedate,
        boardId: null,
      },
      onCompleted: () => {
        Toast.show(`Task ${title} added.`, {
          duration: Toast.durations.LONG,
        });
        setTitle("");
        setNotes("");
        setDuedate(new Date());
        refetch();
      },
      onError: (error) => {
        console.log("[GraphQL Error] " + error);
      },
    });
  };

  const handleCompleteTask = (item: Task) => {
    completeTask({
      variables: {
        completeTaskId: item.id,
      },
      onCompleted: () => {
        Toast.show(`Task ${item.title} done.`, {
          duration: Toast.durations.LONG,
        });
        refetch();
      },
      onError: (error) => {
        console.log("[GraphQL Error] " + error);
      },
    });
  };

  return (
    <Box className="flex-1 ">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: isWeb ? 0 : 100,
          flexGrow: 1,
        }}
        className="flex-1 mb-20 md:mb-2"
      >
        <VStack className="p-4 pb-0 md:px-10 md:pt-6  w-full" space="2xl">
          <Heading size="2xl" className="font-roboto">
            Tasks
          </Heading>

          <GridItem
            _extra={{
              className: "col-span-12 sm:col-span-6 lg:col-span-4",
            }}
          >
            <HStack
              space="md"
              className="border border-border-300 rounded-lg p-4 items-center justify-between"
            >
              <HStack space="md">
                <VStack style={{ width: "80%" }} space="md">
                  <Input>
                    <InputField
                      type="text"
                      placeholder="Title"
                      value={title}
                      onChangeText={setTitle}
                    />
                  </Input>
                  <Textarea size="md" className="w-100">
                    <TextareaInput
                      placeholder="Description"
                      value={notes}
                      onChangeText={setNotes}
                    />
                  </Textarea>
                  <DateTimePicker
                    value={duedate}
                    onChange={(_, date) => setDuedate(new Date(String(date)))}
                  />
                </VStack>
              </HStack>
              <Button size="xs" onPress={handleAddTask}>
                <ButtonText>Add</ButtonText>
              </Button>
            </HStack>
          </GridItem>

          {loading ? (
            <Spinner />
          ) : (
            data?.myTasks.map((item: Task) => {
              return (
                <GridItem
                  _extra={{
                    className: "col-span-12 sm:col-span-6 lg:col-span-4",
                  }}
                  key={item.id}
                >
                  <HStack
                    space="md"
                    className="border border-border-300 rounded-lg p-4 items-center justify-between"
                  >
                    <HStack space="xl" className="items-center">
                      <VStack>
                        <Text className="font-semibold text-typography-900 line-clamp-1">
                          {item.title}
                        </Text>
                        <Text className="line-clamp-1">{item.notes}</Text>
                        <Text className="line-clamp-1">
                          {formatDate(item.duedate)}
                        </Text>
                      </VStack>
                    </HStack>
                    <VStack>
                      <Button
                        size="xs"
                        action="positive"
                        onPress={() => handleCompleteTask(item)}
                      >
                        <ButtonText>Done</ButtonText>
                      </Button>
                    </VStack>
                  </HStack>
                </GridItem>
              );
            })
          )}
        </VStack>
      </ScrollView>
    </Box>
  );
};

export const List = () => {
  return (
    <SafeAreaView className="h-full w-full">
      <MainContent />
    </SafeAreaView>
  );
};
