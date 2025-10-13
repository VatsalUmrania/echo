import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@workspace/ui/components/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@workspace/ui/components/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@workspace/ui/components/form";
import { Input } from "@workspace/ui/components/input";
import { Separator } from "@workspace/ui/components/separator";
import { Textarea } from "@workspace/ui/components/textarea";
import { Doc } from "@workspace/backend/_generated/dataModel";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { VapiFormFields } from "./vapi-form-fields";
import { FormSchema } from "../../types";
import { widgetSettingSchema } from "../../schema";


type WidgetSettings = Doc<"widgetSettings">;
interface CustomizationFormProps {
    intialData?: WidgetSettings| null;
    hasVapiPlugin?: boolean
};

export const CustomizationForm = ({ intialData, hasVapiPlugin } : CustomizationFormProps) => {
    const upsertWidgetSettings = useMutation(api.private.widgetSetting.upsert); 
    
    const form = useForm<FormSchema>({
        resolver: zodResolver(widgetSettingSchema),
        defaultValues: {
            greetMessage:
                intialData?.greetMessage || "Hi! How can I help you Today",
            defaultSuggestions: {
                suggestion1: intialData?.defaultSuggestions.suggestion1 || "",
                suggestion2: intialData?.defaultSuggestions.suggestion2 || "",
                suggestion3: intialData?.defaultSuggestions.suggestion3 || ""
            },
            vapiSettings: {
                assistantId : intialData?.vapiSetting.assistantId || "",
                phoneNumber : intialData?.vapiSetting.phoneNumber || "",
            },
        },
    });

    const onSubmit = async ( values : FormSchema) => {
        try {
            const vapiSetting : WidgetSettings["vapiSetting"] = {
                assistantId : values.vapiSettings.assistantId === "none"
                    ? ""
                    : values.vapiSettings.assistantId,
                phoneNumber : values.vapiSettings.phoneNumber === "none"
                    ? ""
                    : values.vapiSettings.phoneNumber
            };
            toast.success("Widget Setting Saved")
            await upsertWidgetSettings({
                greetMessage: values.greetMessage,
                defaultSuggestions: values.defaultSuggestions,
                vapiSetting
            });

        } catch (error) {
            console.error(error);
            toast.error("Something Went Wrong!!!")
        }
    }
    
    return(
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardHeader>
                        <CardTitle>General Chat Settings</CardTitle>
                        <CardDescription>
                            Configure Basic Chat Widget Behavoir and Messages
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <FormField
                            control={form.control}
                            name="greetMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Greeting Message
                                    </FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            placeholder="Welcome Message Shown When Chat Open"
                                            rows={3}
                                        />
                                    </FormControl>
                                    <FormDescription>The First Message Customers see when they open the chat.</FormDescription>
                                    <FormMessage/>
                                </FormItem>
                            )}
                        />

                        <Separator/>
                        
                        <div className="space-y-4">
                            <div>
                                <h3 className="mb-4 text-sm">
                                    Default Suggestions
                                </h3>
                                <p className="mb-4 text-sm text-muted-foreground">
                                    Quick Reply Suggestions shown to customers to help guide the conversations
                                </p>

                                <div className="space-y-4">
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion1"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Suggestion 1
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., How do I get Started?"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion2"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Suggestion 2
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., What are your pricing plans?"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="defaultSuggestions.suggestion3"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Suggestion 3
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        {...field}
                                                        placeholder="e.g., I need help with my account"
                                                    />
                                                </FormControl>
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {hasVapiPlugin && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Voice Assistant Settings</CardTitle>
                            <CardDescription>
                                Configure Voice Calling Features Powered by VAPI
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <VapiFormFields
                                form={form}

                            />
                        </CardContent>
                    </Card>
                )}

                <div className="flex justify-end">
                    <Button disabled={form.formState.isSubmitting} type="submit">
                        Save Settings
                    </Button>
                </div>
            </form>
        </Form> 
    )
}