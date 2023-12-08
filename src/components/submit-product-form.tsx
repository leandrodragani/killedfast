"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Category, ProductStatus, Tag } from "@prisma/client";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";
import { ChevronsUpDown, Check, CalendarIcon, X, Loader2 } from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Calendar } from "./ui/calendar";
import { format } from "date-fns";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

const maxLength = {
  name: 40,
  slogan: 60,
  description: 500,
  lessonsLearned: 1200,
  reasonForFailure: 1200,
  keyChallenges: 1200,
  whatWouldYouDoDifferently: 1200,
  tipsOrAdvice: 1200,
};

const submitProductFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name is required.",
    })
    .max(maxLength.name, {
      message: `Name must not be longer than ${maxLength.name} characters.`,
    }),
  website: z.string().url().optional(),
  slogan: z
    .string()
    .min(1, {
      message: "Slogan is required.",
    })
    .max(maxLength.slogan, {
      message: `Slogan must not be longer than ${maxLength.slogan} characters.`,
    }),
  description: z
    .string()
    .min(10, {
      message: "Description must be at least 10 characters.",
    })
    .max(maxLength.description, {
      message: `Description must not be longer than ${maxLength.description} characters.`,
    }),
  category: z.string().min(1, { message: "Category is required." }),
  tags: z.array(z.object({ value: z.string() })).optional(),
  lessonsLearned: z
    .string()
    .min(10)
    .max(maxLength.lessonsLearned, {
      message: `Lessons learned must not be longer than ${maxLength.lessonsLearned} characters.`,
    }),
  status: z.enum(
    [ProductStatus.DEAD, ProductStatus.ALMOST_DEAD, ProductStatus.BARELY_ALIVE],
    {
      required_error: "You need to select a status.",
    }
  ),
  dateOfCreation: z.date(),
  rangeOfExistence: z.object({
    from: z.date(),
    to: z.date().optional(),
  }),
  numberOfUsers: z.coerce.number().min(0),
  resourcesUrls: z
    .array(
      z.object({
        value: z.string().url({ message: "Please enter a valid URL." }),
      })
    )
    .optional(),
  reasonForFailure: z
    .string()
    .min(1, { message: "Reason is required." })
    .max(maxLength.reasonForFailure, {
      message: `Reason must not be longer than ${maxLength.reasonForFailure} characters.`,
    }),
  keyChallenges: z
    .string()
    .min(1, { message: "Key challenges are required." })
    .max(maxLength.keyChallenges, {
      message: `Key challenges must not be longer than ${maxLength.keyChallenges} characters.`,
    }),
  whatWouldYouDoDifferently: z.string().optional(),
  tipsOrAdvice: z
    .string()
    .min(1, { message: "Tips or advice are required." })
    .max(maxLength.tipsOrAdvice, {
      message: `Tips or advice must not be longer than ${maxLength.tipsOrAdvice} characters.`,
    }),
  xAccount: z.string().optional(),
});

export type SubmitProductFormValues = z.infer<typeof submitProductFormSchema>;

const initialValues: Partial<SubmitProductFormValues> = {
  name: "",
  website: "",
  slogan: "",
  description: "",
  category: "",
  tags: [{ value: "" }],
  lessonsLearned: "",
  status: ProductStatus.DEAD,
  dateOfCreation: new Date(),
  rangeOfExistence: {
    from: new Date(),
    to: new Date(),
  },
  numberOfUsers: 0,
  resourcesUrls: [{ value: "" }],
  reasonForFailure: "",
  keyChallenges: "",
  whatWouldYouDoDifferently: "",
  tipsOrAdvice: "",
  xAccount: "",
};

export function SubmitProductForm({
  categories,
  tags,
  defaultValues = initialValues,
}: {
  categories: Category[];
  tags: Tag[];
  defaultValues?: Partial<SubmitProductFormValues>;
}) {
  const { push } = useRouter();
  const form = useForm<SubmitProductFormValues>({
    resolver: zodResolver(submitProductFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const {
    fields: tagsFields,
    append: appendTags,
    remove: removeTags,
  } = useFieldArray({
    control: form.control,
    name: "tags",
  });

  const {
    fields: resourcesUrlsFields,
    append: appendResourcesUrls,
    remove: removeResourcesUrls,
  } = useFieldArray({
    name: "resourcesUrls",
    control: form.control,
  });

  const {
    name,
    description,
    slogan,
    lessonsLearned,
    status,
    reasonForFailure,
    keyChallenges,
    tipsOrAdvice,
    whatWouldYouDoDifferently,
  } = form.watch();

  async function onSubmit(values: SubmitProductFormValues) {
    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          dateOfCreation: values.dateOfCreation?.toISOString(),
          rangeOfExistence: {
            from: values.rangeOfExistence?.from?.toISOString(),
            to: values.rangeOfExistence?.to?.toISOString(),
          },
        }),
      });

      const newProduct = await response.json();

      toast({
        title: "Your product has been submitted!",
        description: "Redirecting you to your product page...",
      });

      setTimeout(() => push(`/products/${newProduct.slug}`), 3000);
    } catch (error) {
      toast({
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Basic information</h3>
            <p className="text-sm text-muted-foreground">
              Tell us about your product.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name of your product</FormLabel>
                <FormControl>
                  <Input placeholder="KilledFast" {...field} />
                </FormControl>
                <FormDescription>
                  {name.length}/{maxLength.name}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="website"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Website</FormLabel>
                <FormControl>
                  <Input placeholder="https://www.killedfast.com" {...field} />
                </FormControl>
                <FormDescription>
                  If you took the website down, leave this field empty.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slogan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slogan</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Showcase your failed products"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tell us about your product in one sentence. {slogan.length}/
                  {maxLength.slogan}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Description of your product"
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {description.length}/{maxLength.description}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Product categorization</h3>
            <p className="text-sm text-muted-foreground">
              Help others find your product.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={category.id.toString()}
                      >
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="space-y-4">
            {tagsFields.map((field, index) => (
              <FormField
                key={field.id}
                control={form.control}
                name={`tags.${index}.value`}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Tags
                    </FormLabel>
                    <FormDescription
                      className={cn(index !== 0 && "sr-only", "pt-1 pb-2")}
                    >
                      Add tags to your product to help others find it. You can
                      add up to 5 tags.
                    </FormDescription>
                    <div className="inline-flex space-x-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "w-[350px] justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? tags.find(
                                    (tag) => tag.id.toString() === field?.value
                                  )?.name
                                : "Select tag"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[350px] p-0">
                          <Command>
                            <CommandInput placeholder="Search tags..." />
                            <CommandEmpty>No tags found.</CommandEmpty>
                            <CommandGroup>
                              <ScrollArea className="h-[200px]">
                                {tags.map((tag) => (
                                  <CommandItem
                                    value={tag.name}
                                    key={tag.id}
                                    onSelect={() => {
                                      field.onChange(tag.id.toString());
                                    }}
                                    onBlur={field.onBlur}
                                    className="cursor-pointer"
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        tag.id.toString() === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {tag.name}
                                  </CommandItem>
                                ))}
                              </ScrollArea>
                            </CommandGroup>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      {index !== 0 ? (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeTags(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            {tagsFields.length < 5 ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => appendTags({ value: "" })}
              >
                Add tag
              </Button>
            ) : null}
          </div>
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">The excitement of starting</h3>
            <p className="text-sm text-muted-foreground">
              Tell us about the start of your product.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>
                  What do you think is the status of your product?
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ProductStatus.DEAD} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Dead (no longer available)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ProductStatus.ALMOST_DEAD} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Almost dead (no longer maintained)
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value={ProductStatus.BARELY_ALIVE} />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Barely alive (I think i can revive it)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {status !== ProductStatus.DEAD ? (
            <FormField
              control={form.control}
              name="dateOfCreation"
              key={status}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date of creation</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field?.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field?.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field?.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The date you started working on your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          ) : (
            <FormField
              control={form.control}
              name="rangeOfExistence"
              key={status}
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Range of existence</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                          "w-[260px] justify-start text-left font-normal",
                          !field && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value?.from ? (
                          field?.value?.to ? (
                            <>
                              {format(field?.value?.from, "LLL dd, y")} -{" "}
                              {format(field?.value?.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(field?.value?.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={field?.value?.from}
                        selected={field?.value}
                        onSelect={field.onChange}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The birth and death date of your product.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="numberOfUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>How many users did you manage to onboard?</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">The fall of your product</h3>
            <p className="text-sm text-muted-foreground">
              Tell us about the fall of your product.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="reasonForFailure"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  What do YOU think was the main reason for the failure?
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Losing a major client, technical challenges"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {reasonForFailure.length}/{maxLength.reasonForFailure}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="keyChallenges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Key challenges faced</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  {keyChallenges.length}/{maxLength.keyChallenges}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Learnings and Insights</h3>
            <p className="text-sm text-muted-foreground">
              Share your learnings and insights with the community.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="lessonsLearned"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What were the major lessons learned?</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  {lessonsLearned.length}/{maxLength.lessonsLearned}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="whatWouldYouDoDifferently"
            render={({ field }) => (
              <FormItem>
                <FormLabel>What would you have done differently?</FormLabel>
                <FormControl>
                  <Textarea className="resize-none" {...field} />
                </FormControl>
                <FormDescription>
                  {whatWouldYouDoDifferently?.length}/
                  {maxLength.whatWouldYouDoDifferently}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Advice to others</h3>
            <p className="text-sm text-muted-foreground">
              Share your advice with the community.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="tipsOrAdvice"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tips or advice for upcoming entrepeneurs</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    placeholder="Network constantly, be adaptable"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  {tipsOrAdvice.length}/{maxLength.tipsOrAdvice}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            {resourcesUrlsFields.map((field, index) => (
              <FormField
                control={form.control}
                key={field.id}
                name={`resourcesUrls.${index}.value`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={cn(index !== 0 && "sr-only")}>
                      Resources that you found helpful
                    </FormLabel>
                    <FormDescription className={cn(index !== 0 && "sr-only")}>
                      Add links to books, websites, mentors, etc...
                    </FormDescription>
                    <FormControl>
                      <div className="inline-flex space-x-2">
                        <Input
                          className="w-[400px]"
                          placeholder="https://killedfast.com"
                          {...field}
                        />
                        {index !== 0 ? (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeResourcesUrls(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        ) : null}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={() => appendResourcesUrls({ value: "" })}
            >
              Add URL
            </Button>
          </div>
        </div>

        <div className="space-y-8 border p-10 rounded-lg">
          <div>
            <h3 className="text-lg font-medium">Contact Information</h3>
            <p className="text-sm text-muted-foreground">
              Share your contact information with the community.
            </p>
          </div>
          <Separator />

          <FormField
            control={form.control}
            name="xAccount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>X / Twitter</FormLabel>
                <FormControl>
                  <Input placeholder="@yourxaccount" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end pb-20">
          <Button
            size="lg"
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}
